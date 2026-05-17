package com.jenugumpu.app.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState
import com.jenugumpu.app.localization.StringKeys
import com.jenugumpu.app.localization.t
import com.jenugumpu.app.ui.navigation.Screen
import com.jenugumpu.app.ui.theme.*
import com.jenugumpu.app.ui.viewmodel.LocalNotificationViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppTopBar(
    title: String? = null,
    showProfile: Boolean = true,
    showNotifications: Boolean = true,
    onProfileClick: () -> Unit = {},
) {
    val notificationViewModel = LocalNotificationViewModel.current
    val notifications by notificationViewModel.notifications.collectAsStateWithLifecycle()
    val showNotificationDialog = remember { mutableStateOf(false) }

    if (showNotificationDialog.value) {
        NotificationDialog(
            notifications = notifications,
            onDismiss = { showNotificationDialog.value = false },
            onClearAll = { notificationViewModel.clearAll() },
        )
    }

    TopAppBar(
        title = {
            Text(
                text = title ?: t(StringKeys.APP_NAME),
                fontWeight = FontWeight.ExtraBold,
                color = BrandPrimary,
                fontSize = 26.sp,
                letterSpacing = (-0.5).sp
            )
        },
        navigationIcon = {
            if (showNotifications) {
                BadgedBox(
                    badge = {
                        if (notifications.isNotEmpty()) {
                            Badge(containerColor = BrandSecondary)
                        }
                    }
                ) {
                    IconButton(onClick = { showNotificationDialog.value = true }) {
                        Icon(
                            imageVector = Icons.Default.Notifications,
                            contentDescription = t(StringKeys.NOTIFICATIONS),
                            tint = BrandPrimary,
                            modifier = Modifier.size(28.dp),
                        )
                    }
                }
            }
        },
        actions = {
            if (showProfile) {
                ProfileAvatar(
                    modifier = Modifier.padding(4.dp),
                    size = 44.dp,
                    onClick = onProfileClick,
                    contentDescription = t(StringKeys.PROFILE),
                )
                Spacer(modifier = Modifier.width(12.dp))
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = Color.Transparent
        )
    )
}

@Composable
fun JenuGumpuBottomBar(navController: NavController) {
    val items = listOf(
        NavigationItem(t(StringKeys.NAV_HOME), Screen.Dashboard.route, Icons.Default.Home),
        NavigationItem(t(StringKeys.NAV_HARVEST), Screen.HarvestLog.route, Icons.Default.Agriculture),
        NavigationItem(t(StringKeys.NAV_STOCK), Screen.OfflineMode.route, Icons.Default.Inventory2),
        NavigationItem(t(StringKeys.NAV_PRICES), Screen.Reports.route, Icons.Default.Payments),
        NavigationItem(t(StringKeys.NAV_PROFILE), Screen.Profile.route, Icons.Default.Person)
    )

    val navBackStackEntry = navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry.value?.destination?.route

    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .padding(12.dp)
            .clip(RoundedCornerShape(24.dp)),
        color = Color.White,
        shadowElevation = 8.dp
    ) {
        NavigationBar(
            containerColor = Color.White,
            tonalElevation = 0.dp,
            modifier = Modifier.height(80.dp)
        ) {
            items.forEach { item ->
                val isSelected = currentRoute == item.route
                NavigationBarItem(
                    selected = isSelected,
                    onClick = {
                        if (!isSelected) {
                            navController.navigate(item.route) {
                                popUpTo(Screen.Dashboard.route) { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    },
                    icon = {
                        val color = if (isSelected) BrandSecondary else OnBrandSurfaceVariant.copy(alpha = 0.6f)
                        if (isSelected) {
                            Surface(
                                color = BrandSecondaryContainer,
                                shape = CircleShape,
                                modifier = Modifier.size(width = 64.dp, height = 32.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(item.icon, contentDescription = item.name, tint = BrandSecondary)
                                }
                            }
                        } else {
                            Icon(item.icon, contentDescription = item.name, tint = color)
                        }
                    },
                    label = {
                        Text(
                            text = item.name,
                            fontSize = 11.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                            color = if (isSelected) BrandSecondary else OnBrandSurfaceVariant.copy(alpha = 0.6f)
                        )
                    },
                    colors = NavigationBarItemDefaults.colors(
                        indicatorColor = Color.Transparent
                    )
                )
            }
        }
    }
}

data class NavigationItem(val name: String, val route: String, val icon: ImageVector)
