package com.jenugumpu.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import com.jenugumpu.app.auth.CredentialValidator
import com.jenugumpu.app.auth.GoogleSignInOutcome
import com.jenugumpu.app.auth.ValidationError
import com.jenugumpu.app.auth.ValidationResult
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

enum class AuthMethod {
    NONE,
    PHONE,
    GOOGLE,
}

data class UserUiState(
    val fullName: String = "",
    val email: String = "",
    val farmName: String = "Honey Valley Farm",
    val location: String = "Karnataka, India",
    val profilePhotoUri: String? = null,
)

data class AuthUiState(
    val isAuthenticated: Boolean = false,
    val isLoading: Boolean = false,
    val authMethod: AuthMethod = AuthMethod.NONE,
    val pendingPhone: String = "",
    val pendingName: String = "",
    val errorMessage: String? = null,
)

sealed class PhoneLoginRequest {
    data class ProceedToOtp(val phone: String, val name: String = "") : PhoneLoginRequest()
    data class ValidationFailed(val error: ValidationError) : PhoneLoginRequest()
}

sealed class OtpVerificationResult {
    data object Success : OtpVerificationResult()
    data class ValidationFailed(val error: ValidationError) : OtpVerificationResult()
}

class UserViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(UserUiState())
    val uiState: StateFlow<UserUiState> = _uiState.asStateFlow()

    private val _authState = MutableStateFlow(AuthUiState())
    val authState: StateFlow<AuthUiState> = _authState.asStateFlow()

    fun clearAuthError() {
        _authState.update { it.copy(errorMessage = null) }
    }

    fun requestPhoneLogin(phone: String, name: String = ""): PhoneLoginRequest {
        val phoneResult = CredentialValidator.validatePhone(phone)
        if (phoneResult is ValidationResult.Invalid) {
            return PhoneLoginRequest.ValidationFailed(phoneResult.error)
        }

        val normalizedPhone = (phoneResult as ValidationResult.Valid).normalized
        val normalizedName = name.trim()

        if (normalizedName.isNotEmpty()) {
            val nameResult = CredentialValidator.validateName(normalizedName)
            if (nameResult is ValidationResult.Invalid) {
                return PhoneLoginRequest.ValidationFailed(nameResult.error)
            }
        }

        _authState.update {
            it.copy(
                pendingPhone = normalizedPhone,
                pendingName = normalizedName,
                errorMessage = null,
            )
        }
        return PhoneLoginRequest.ProceedToOtp(
            phone = normalizedPhone,
            name = normalizedName,
        )
    }

    fun verifyPhoneOtp(otp: String): OtpVerificationResult {
        when (val result = CredentialValidator.validateOtp(otp)) {
            is ValidationResult.Invalid -> return OtpVerificationResult.ValidationFailed(result.error)
            is ValidationResult.Valid -> {
                val phone = _authState.value.pendingPhone
                if (phone.isEmpty()) {
                    _authState.update {
                        it.copy(errorMessage = "Phone session expired. Please sign in again.")
                    }
                    return OtpVerificationResult.ValidationFailed(ValidationError.OtpInvalid)
                }

                val displayName = _authState.value.pendingName.ifEmpty { "Honey Farmer" }
                completeSignIn(
                    fullName = displayName,
                    email = CredentialValidator.phoneToEmail(phone),
                    method = AuthMethod.PHONE,
                )
                return OtpVerificationResult.Success
            }
        }
    }

    fun handleGoogleSignInOutcome(outcome: GoogleSignInOutcome) {
        _authState.update { it.copy(isLoading = false) }
        when (outcome) {
            is GoogleSignInOutcome.Success -> {
                completeSignIn(
                    fullName = outcome.account.displayName,
                    email = outcome.account.email,
                    method = AuthMethod.GOOGLE,
                )
            }
            GoogleSignInOutcome.Cancelled -> Unit
            is GoogleSignInOutcome.Failure -> {
                _authState.update { it.copy(errorMessage = outcome.message) }
            }
        }
    }

    fun setGoogleSignInLoading(loading: Boolean) {
        _authState.update { it.copy(isLoading = loading, errorMessage = if (loading) null else it.errorMessage) }
    }

    fun signOut() {
        _authState.value = AuthUiState()
        _uiState.value = UserUiState()
    }

    fun updateFullName(name: String) {
        _uiState.update { it.copy(fullName = name) }
    }

    fun updateEmail(email: String) {
        _uiState.update { it.copy(email = email) }
    }

    fun updateFarmName(farmName: String) {
        _uiState.update { it.copy(farmName = farmName) }
    }

    fun updateLocation(location: String) {
        _uiState.update { it.copy(location = location) }
    }

    fun setProfilePhotoUri(uri: String?) {
        _uiState.update { it.copy(profilePhotoUri = uri?.trim()?.takeIf { it.isNotEmpty() }) }
    }

    fun removeProfilePhoto() {
        _uiState.update { it.copy(profilePhotoUri = null) }
    }

    fun saveProfile() {
        // Persist profile when backend is available
    }

    private fun completeSignIn(fullName: String, email: String, method: AuthMethod) {
        _uiState.update {
            it.copy(
                fullName = fullName.trim(),
                email = email.trim(),
            )
        }
        _authState.update {
            it.copy(
                isAuthenticated = true,
                isLoading = false,
                authMethod = method,
                errorMessage = null,
            )
        }
    }
}
