package com.jenugumpu.app.ui.screens

import android.content.ActivityNotFoundException
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.jenugumpu.app.localization.StringKeys
import com.jenugumpu.app.localization.t
import com.jenugumpu.app.support.SupportIntents
import com.jenugumpu.app.ui.navigation.Screen
import com.jenugumpu.app.ui.theme.BrandPrimary
import com.jenugumpu.app.ui.theme.OnBrandSurfaceVariant
import com.jenugumpu.app.ui.viewmodel.LocalMainViewModel
import com.jenugumpu.app.ui.viewmodel.LocalSettingsViewModel
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(navController: NavController) {
    val context = LocalContext.current
    val settingsViewModel = LocalSettingsViewModel.current
    val mainViewModel = LocalMainViewModel.current
    val settingsState by settingsViewModel.uiState.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    fun openWhatsAppSupport() {
        val intent = SupportIntents.whatsAppSupportIntent(context)
        try {
            if (intent.resolveActivity(context.packageManager) != null) {
                context.startActivity(intent)
            } else {
                scope.launch {
                    snackbarHostState.showSnackbar(
                        mainViewModel.getTranslatedString(StringKeys.SUPPORT_WHATSAPP_UNAVAILABLE)
                    )
                }
            }
        } catch (_: ActivityNotFoundException) {
            scope.launch {
                snackbarHostState.showSnackbar(
                    mainViewModel.getTranslatedString(StringKeys.SUPPORT_WHATSAPP_UNAVAILABLE)
                )
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(t(StringKeys.SETTINGS), fontWeight = FontWeight.Bold, color = BrandPrimary) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = t(StringKeys.BACK), tint = BrandPrimary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) },
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 24.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item { Spacer(modifier = Modifier.height(16.dp)) }

            item {
                SettingsSectionHeader(t(StringKeys.ACCOUNT))
            }
            item {
                SettingsItem(
                    title = t(StringKeys.PROFILE_INFORMATION),
                    subtitle = t(StringKeys.PROFILE_INFORMATION_SUBTITLE),
                    icon = Icons.Default.Person,
                    onClick = { navController.navigate(Screen.ProfileEdit.route) }
                )
            }
            item {
                SettingsItem(
                    title = t(StringKeys.LANGUAGE),
                    subtitle = settingsState.selectedLanguage.displayName,
                    icon = Icons.Default.Language,
                    onClick = { navController.navigate(Screen.Language.route) }
                )
            }

            item {
                SettingsSectionHeader(t(StringKeys.PREFERENCES))
            }
            item {
                SettingsItemWithSwitch(
                    title = t(StringKeys.PUSH_NOTIFICATIONS),
                    subtitle = t(StringKeys.PUSH_NOTIFICATIONS_SUBTITLE),
                    icon = Icons.Default.Notifications,
                    checked = settingsState.pushNotificationsEnabled,
                    onCheckedChange = settingsViewModel::setPushNotificationsEnabled
                )
            }
            item {
                SettingsItemWithSwitch(
                    title = t(StringKeys.OFFLINE_MODE),
                    subtitle = t(StringKeys.OFFLINE_MODE_SUBTITLE),
                    icon = Icons.Default.CloudOff,
                    checked = settingsState.offlineModeEnabled,
                    onCheckedChange = settingsViewModel::setOfflineModeEnabled
                )
            }

            item {
                SettingsSectionHeader(t(StringKeys.SUPPORT))
            }
            item {
                SettingsItem(
                    title = t(StringKeys.HELP_CENTER),
                    subtitle = t(StringKeys.HELP_CENTER_SUBTITLE),
                    icon = Icons.Default.Help,
                    onClick = { openWhatsAppSupport() }
                )
            }
            item {
                SettingsItem(
                    title = t(StringKeys.CONTACT_SUPPORT),
                    subtitle = t(StringKeys.CONTACT_SUPPORT_SUBTITLE),
                    icon = Icons.Default.SupportAgent,
                    onClick = { openWhatsAppSupport() }
                )
            }

            item { Spacer(modifier = Modifier.height(32.dp)) }
        }
    }
}

@Composable
fun SettingsSectionHeader(title: String) {
    Text(
        text = title.uppercase(),
        fontSize = 12.sp,
        fontWeight = FontWeight.Bold,
        color = OnBrandSurfaceVariant.copy(alpha = 0.5f),
        letterSpacing = 1.sp,
        modifier = Modifier.padding(top = 12.dp, bottom = 4.dp)
    )
}

@Composable
fun SettingsItem(
    title: String,
    subtitle: String,
    icon: ImageVector,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth().clickable { onClick() },
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = BorderStroke(1.dp, Color.Black.copy(alpha = 0.05f))
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                color = BrandPrimary.copy(alpha = 0.1f),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.size(44.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(icon, contentDescription = null, tint = BrandPrimary, modifier = Modifier.size(24.dp))
                }
            }
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                Text(subtitle, fontSize = 12.sp, color = OnBrandSurfaceVariant.copy(alpha = 0.6f))
            }
            Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Color.Gray.copy(alpha = 0.5f))
        }
    }
}

@Composable
fun SettingsItemWithSwitch(
    title: String,
    subtitle: String,
    icon: ImageVector,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = BorderStroke(1.dp, Color.Black.copy(alpha = 0.05f))
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                color = BrandPrimary.copy(alpha = 0.1f),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.size(44.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(icon, contentDescription = null, tint = BrandPrimary, modifier = Modifier.size(24.dp))
                }
            }
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                Text(subtitle, fontSize = 12.sp, color = OnBrandSurfaceVariant.copy(alpha = 0.6f))
            }
            Switch(
                checked = checked,
                onCheckedChange = onCheckedChange,
                colors = SwitchDefaults.colors(
                    checkedThumbColor = Color.White,
                    checkedTrackColor = BrandPrimary,
                    uncheckedThumbColor = Color.White,
                    uncheckedTrackColor = Color.Gray.copy(alpha = 0.3f),
                    uncheckedBorderColor = Color.Transparent
                )
            )
        }
    }
}
