package com.jenugumpu.app.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.jenugumpu.app.localization.StringKeys
import com.jenugumpu.app.localization.t
import com.jenugumpu.app.ui.components.AppTopBar
import com.jenugumpu.app.ui.components.JenuGumpuBottomBar
import com.jenugumpu.app.ui.components.ProfileAvatar
import com.jenugumpu.app.ui.navigation.Screen
import com.jenugumpu.app.ui.theme.BrandPrimary
import com.jenugumpu.app.ui.theme.OnBrandSurfaceVariant
import com.jenugumpu.app.ui.viewmodel.LocalUserViewModel

@Composable
fun ProfileScreen(navController: NavController) {
    val userViewModel = LocalUserViewModel.current
    val userState by userViewModel.uiState.collectAsStateWithLifecycle()
    var showLogoutDialog by remember { mutableStateOf(false) }

    if (showLogoutDialog) {
        AlertDialog(
            onDismissRequest = { showLogoutDialog = false },
            title = { Text(t(StringKeys.SIGN_OUT), fontWeight = FontWeight.Bold) },
            text = { Text(t(StringKeys.LOGOUT_CONFIRM)) },
            confirmButton = {
                TextButton(
                    onClick = {
                        showLogoutDialog = false
                        userViewModel.signOut()
                        navController.navigate(Screen.Login.route) {
                            popUpTo(Screen.Dashboard.route) { inclusive = true }
                        }
                    },
                ) {
                    Text(t(StringKeys.CONFIRM_LOGOUT), color = BrandPrimary, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showLogoutDialog = false }) {
                    Text(t(StringKeys.CANCEL))
                }
            },
        )
    }

    Scaffold(
        topBar = {
            AppTopBar(
                showProfile = false,
                showNotifications = true,
            )
        },
        bottomBar = { JenuGumpuBottomBar(navController) },
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Spacer(modifier = Modifier.height(24.dp))

            ProfileAvatar(
                size = 112.dp,
                showBorder = true,
                onClick = { navController.navigate(Screen.ProfileEdit.route) },
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = userState.fullName.ifBlank { t(StringKeys.PROFILE) },
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = BrandPrimary,
            )
            if (userState.email.isNotBlank()) {
                Text(
                    text = userState.email,
                    fontSize = 14.sp,
                    color = OnBrandSurfaceVariant,
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            ProfileInfoCard(
                label = t(StringKeys.BUSINESS_FARM_NAME),
                value = userState.farmName,
            )
            Spacer(modifier = Modifier.height(12.dp))
            ProfileInfoCard(
                label = t(StringKeys.LOCATION),
                value = userState.location,
            )

            Spacer(modifier = Modifier.height(24.dp))

            ProfileActionRow(
                title = t(StringKeys.EDIT_PROFILE),
                icon = Icons.Default.Edit,
                onClick = { navController.navigate(Screen.ProfileEdit.route) },
            )
            Spacer(modifier = Modifier.height(12.dp))
            ProfileActionRow(
                title = t(StringKeys.SETTINGS),
                icon = Icons.Default.Settings,
                onClick = { navController.navigate(Screen.Settings.route) },
            )

            Spacer(modifier = Modifier.height(32.dp))

            OutlinedButton(
                onClick = { showLogoutDialog = true },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp),
                border = BorderStroke(2.dp, MaterialTheme.colorScheme.error.copy(alpha = 0.5f)),
            ) {
                Icon(
                    Icons.AutoMirrored.Filled.Logout,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.error,
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    t(StringKeys.SIGN_OUT),
                    color = MaterialTheme.colorScheme.error,
                    fontWeight = FontWeight.Bold,
                )
            }

            Spacer(modifier = Modifier.height(16.dp))
            Text(
                t(StringKeys.LOGOUT_DISCLAIMER),
                textAlign = TextAlign.Center,
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f),
                modifier = Modifier.padding(bottom = 24.dp),
            )
        }
    }
}

@Composable
private fun ProfileInfoCard(label: String, value: String) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = BorderStroke(1.dp, Color.Black.copy(alpha = 0.05f)),
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = label.uppercase(),
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = OnBrandSurfaceVariant.copy(alpha = 0.6f),
                letterSpacing = 0.5.sp,
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = value, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
        }
    }
}

@Composable
private fun ProfileActionRow(
    title: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    onClick: () -> Unit,
) {
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = BorderStroke(1.dp, Color.Black.copy(alpha = 0.05f)),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(icon, contentDescription = null, tint = BrandPrimary)
            Spacer(modifier = Modifier.width(16.dp))
            Text(title, modifier = Modifier.weight(1f), fontWeight = FontWeight.Bold)
            Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Color.Gray.copy(alpha = 0.5f))
        }
    }
}
