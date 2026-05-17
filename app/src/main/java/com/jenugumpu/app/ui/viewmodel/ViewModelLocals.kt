package com.jenugumpu.app.ui.viewmodel

import androidx.compose.runtime.compositionLocalOf

val LocalMainViewModel = compositionLocalOf<MainViewModel> {
    error("MainViewModel not provided")
}

val LocalSettingsViewModel = compositionLocalOf<SettingsViewModel> {
    error("SettingsViewModel not provided")
}

val LocalUserViewModel = compositionLocalOf<UserViewModel> {
    error("UserViewModel not provided")
}

val LocalNotificationViewModel = compositionLocalOf<NotificationViewModel> {
    error("NotificationViewModel not provided")
}
