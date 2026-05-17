package com.jenugumpu.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import com.jenugumpu.app.localization.AppLanguage
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

data class SettingsUiState(
    val selectedLanguage: AppLanguage = AppLanguage.ENGLISH,
    val pushNotificationsEnabled: Boolean = true,
    val offlineModeEnabled: Boolean = true,
    val isOnline: Boolean = true,
)

class SettingsViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(SettingsUiState())
    val uiState: StateFlow<SettingsUiState> = _uiState.asStateFlow()

    fun setLanguage(language: AppLanguage) {
        _uiState.update { it.copy(selectedLanguage = language) }
    }

    fun setPushNotificationsEnabled(enabled: Boolean) {
        _uiState.update { it.copy(pushNotificationsEnabled = enabled) }
    }

    fun setOfflineModeEnabled(enabled: Boolean) {
        _uiState.update { it.copy(offlineModeEnabled = enabled) }
    }

    fun setOnline(online: Boolean) {
        _uiState.update { it.copy(isOnline = online) }
    }

    fun toggleOnlineStatus() {
        _uiState.update { it.copy(isOnline = !it.isOnline) }
    }
}
