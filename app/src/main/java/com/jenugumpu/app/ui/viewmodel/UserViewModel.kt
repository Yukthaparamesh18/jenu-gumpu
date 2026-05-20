package com.jenugumpu.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import com.jenugumpu.app.auth.CredentialValidator
import com.jenugumpu.app.auth.GoogleSignInOutcome
import com.jenugumpu.app.auth.ValidationError
import com.jenugumpu.app.auth.ValidationResult
import com.jenugumpu.app.backend.SupabaseModule
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.auth.providers.builtin.Email
import io.github.jan.supabase.storage.storage
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import io.github.jan.supabase.auth.providers.builtin.IDToken
import io.github.jan.supabase.auth.providers.Google

enum class AuthMethod {
    NONE,
    PHONE,
    GOOGLE,
    EMAIL,
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
    val successMessage: String? = null,
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

    init {
        checkActiveSession()
    }

    private fun checkActiveSession() {
        viewModelScope.launch {
            try {
                val user = SupabaseModule.client.auth.currentUserOrNull()
                if (user != null) {
                    val displayName = user.userMetadata?.get("full_name")?.toString()
                        ?: user.userMetadata?.get("name")?.toString()
                        ?: "Honey Farmer"
                    completeSignIn(
                        fullName = displayName,
                        email = user.email ?: "",
                        method = AuthMethod.EMAIL,
                        isNewUser = false
                    )
                }
            } catch (e: Exception) {
                android.util.Log.e("UserViewModel", "Session check failed", e)
            }
        }
    }

    fun clearAuthError() {
        _authState.update { it.copy(errorMessage = null) }
    }

    fun clearAuthSuccess() {
        _authState.update { it.copy(successMessage = null) }
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
                    isNewUser = _authState.value.pendingName.isNotEmpty()
                )
                return OtpVerificationResult.Success
            }
        }
    }

    fun handleGoogleSignInOutcome(outcome: GoogleSignInOutcome) {
        _authState.update { it.copy(isLoading = false) }
        when (outcome) {
            is GoogleSignInOutcome.Success -> {
                val token = outcome.account.idToken
                if (token != null) {
                    viewModelScope.launch {
                        _authState.update { it.copy(isLoading = true, errorMessage = null) }
                        try {
                            SupabaseModule.client.auth.signInWith(IDToken) {
                                idToken = token
                                provider = Google
                            }
                            completeSignIn(
                                fullName = outcome.account.displayName,
                                email = outcome.account.email,
                                method = AuthMethod.GOOGLE,
                                isNewUser = false
                            )
                        } catch (e: Exception) {
                            _authState.update { it.copy(isLoading = false, errorMessage = e.message ?: "Google Auth failed") }
                        }
                    }
                } else {
                    completeSignIn(
                        fullName = outcome.account.displayName,
                        email = outcome.account.email,
                        method = AuthMethod.GOOGLE,
                        isNewUser = false
                    )
                }
            }
            GoogleSignInOutcome.Cancelled -> {
                _authState.update { it.copy(errorMessage = "Google sign-in cancelled or failed. Please check your Google account connection.") }
            }
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

    suspend fun loginUser(emailText: String, passwordText: String) {
        _authState.update { it.copy(isLoading = true, errorMessage = null) }
        try {
            SupabaseModule.client.auth.signInWith(Email) {
                this.email = emailText
                this.password = passwordText
            }

            val user = SupabaseModule.client.auth.currentUserOrNull()
            if (user != null) {
                completeSignIn(
                    fullName = "User", // Simplified to avoid metadata resolution issues for now
                    email = user.email ?: emailText,
                    method = AuthMethod.EMAIL,
                    isNewUser = false
                )
            } else {
                _authState.update { it.copy(isLoading = false, errorMessage = "Login failed: No user session.") }
            }
        } catch (e: Exception) {
            _authState.update { it.copy(isLoading = false, errorMessage = e.message ?: "Login failed") }
        }
    }

    suspend fun registerUser(emailText: String, passwordText: String, fullName: String) {
        _authState.update { it.copy(isLoading = true, errorMessage = null) }
        try {
            SupabaseModule.client.auth.signUpWith(Email) {
                this.email = emailText
                this.password = passwordText
            }

            val user = SupabaseModule.client.auth.currentUserOrNull()
            if (user != null) {
                completeSignIn(
                    fullName = fullName,
                    email = user.email ?: emailText,
                    method = AuthMethod.EMAIL,
                    isNewUser = true
                )
            } else {
                _authState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = "Registration successful! Please verify your email."
                    )
                }
            }
        } catch (e: Exception) {
            _authState.update { it.copy(isLoading = false, errorMessage = e.message ?: "Registration failed") }
        }
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
        _uiState.update { state -> state.copy(profilePhotoUri = uri?.trim()?.takeIf { it.isNotBlank() }) }
    }

    fun removeProfilePhoto() {
        _uiState.update { it.copy(profilePhotoUri = null) }
    }

    suspend fun uploadProfileImage(bytes: ByteArray) {
        try {
            val bucket = SupabaseModule.client.storage.from("profiles")
            // Using a simple path for now; in production, use user IDs
            bucket.upload(path = "profile.jpg", data = bytes) {
                upsert = true
            }
            val imageUrl = bucket.publicUrl("profile.jpg")
            setProfilePhotoUri(imageUrl)
        } catch (e: Exception) {
            _authState.update { it.copy(errorMessage = "Upload failed: ${e.message}") }
        }
    }

    fun saveProfile() {
        // Persist profile when backend is available
    }

    private fun completeSignIn(fullName: String, email: String, method: AuthMethod, isNewUser: Boolean = false) {
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
                successMessage = if (isNewUser) "Successfully registered!" else "Login successful!"
            )
        }
    }
}
