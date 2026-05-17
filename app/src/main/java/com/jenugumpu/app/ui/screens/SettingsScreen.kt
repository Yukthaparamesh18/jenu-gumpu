package com.jenugumpu.app.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.compose.runtime.getValue
import androidx.navigation.NavController
import com.jenugumpu.app.localization.appStrings
import com.jenugumpu.app.ui.navigation.Screen
import com.jenugumpu.app.ui.theme.BrandPrimary
import com.jenugumpu.app.ui.theme.OnBrandSurfaceVariant
import com.jenugumpu.app.ui.viewmodel.LocalSettingsViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(navController: NavController) {
    val s = appStrings()
    val settingsViewModel = LocalSettingsViewModel.current
    val settingsState by settingsViewModel.uiState.collectAsStateWithLifecycle()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(s.settings, fontWeight = FontWeight.Bold, color = BrandPrimary) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = s.back, tint = BrandPrimary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        }
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
                SettingsSectionHeader(s.account)
            }
            item {
                SettingsItem(
                    title = s.profileInformation,
                    subtitle = s.profileInformationSubtitle,
                    icon = Icons.Default.Person,
                    onClick = { navController.navigate(Screen.ProfileEdit.route) }
                )
            }
            item {
                SettingsItem(
                    title = s.language,
                    subtitle = settingsState.selectedLanguage.displayName,
                    icon = Icons.Default.Language,
                    onClick = { navController.navigate(Screen.Language.route) }
                )
            }

            item {
                SettingsSectionHeader(s.preferences)
            }
            item {
                SettingsItemWithSwitch(
                    title = s.pushNotifications,
                    subtitle = s.pushNotificationsSubtitle,
                    icon = Icons.Default.Notifications,
                    checked = settingsState.pushNotificationsEnabled,
                    onCheckedChange = settingsViewModel::setPushNotificationsEnabled
                )
            }
            item {
                SettingsItemWithSwitch(
                    title = s.offlineMode,
                    subtitle = s.offlineModeSubtitle,
                    icon = Icons.Default.CloudOff,
                    checked = settingsState.offlineModeEnabled,
                    onCheckedChange = settingsViewModel::setOfflineModeEnabled
                )
            }

            item {
                SettingsSectionHeader(s.support)
            }
            item {
                SettingsItem(
                    title = s.helpCenter,
                    subtitle = s.helpCenterSubtitle,
                    icon = Icons.Default.Help,
                    onClick = {}
                )
            }
            item {
                SettingsItem(
                    title = s.contactSupport,
                    subtitle = s.contactSupportSubtitle,
                    icon = Icons.Default.SupportAgent,
                    onClick = {}
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
