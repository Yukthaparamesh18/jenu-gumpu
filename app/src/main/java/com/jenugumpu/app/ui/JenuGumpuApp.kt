package com.jenugumpu.app.ui

import androidx.activity.ComponentActivity
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.jenugumpu.app.ui.navigation.JenuGumpuNavHost
import com.jenugumpu.app.ui.theme.JenuGumpuTheme
import com.jenugumpu.app.ui.viewmodel.LocalMainViewModel
import com.jenugumpu.app.ui.viewmodel.LocalNotificationViewModel
import com.jenugumpu.app.ui.viewmodel.LocalSettingsViewModel
import com.jenugumpu.app.ui.viewmodel.LocalUserViewModel
import com.jenugumpu.app.ui.viewmodel.MainViewModel
import com.jenugumpu.app.ui.viewmodel.NotificationViewModel
import com.jenugumpu.app.ui.viewmodel.SettingsViewModel
import com.jenugumpu.app.ui.viewmodel.UserViewModel

@Composable
fun JenuGumpuApp() {
    val activity = LocalContext.current as ComponentActivity
    val mainViewModel: MainViewModel = viewModel(viewModelStoreOwner = activity)
    val settingsViewModel: SettingsViewModel = viewModel(viewModelStoreOwner = activity)
    val userViewModel: UserViewModel = viewModel(viewModelStoreOwner = activity)
    val notificationViewModel: NotificationViewModel = viewModel(viewModelStoreOwner = activity)

    val settingsState by settingsViewModel.uiState.collectAsStateWithLifecycle()

    LaunchedEffect(settingsState.selectedLanguage) {
        mainViewModel.setLanguage(settingsState.selectedLanguage)
    }

    JenuGumpuTheme {
        CompositionLocalProvider(
            LocalMainViewModel provides mainViewModel,
            LocalSettingsViewModel provides settingsViewModel,
            LocalUserViewModel provides userViewModel,
            LocalNotificationViewModel provides notificationViewModel,
        ) {
            JenuGumpuNavHost()
        }
    }
}
