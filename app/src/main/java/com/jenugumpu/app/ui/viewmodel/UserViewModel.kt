package com.jenugumpu.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

data class UserUiState(
    val fullName: String = "John Doe",
    val email: String = "john@example.com",
    val farmName: String = "Honey Valley Farm",
    val location: String = "Karnataka, India",
    val profilePhotoUri: String? = null,
)

class UserViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(UserUiState())
    val uiState: StateFlow<UserUiState> = _uiState.asStateFlow()

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

    fun signIn(fullName: String, email: String) {
        _uiState.update {
            it.copy(
                fullName = fullName.trim(),
                email = email.trim(),
            )
        }
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
}
