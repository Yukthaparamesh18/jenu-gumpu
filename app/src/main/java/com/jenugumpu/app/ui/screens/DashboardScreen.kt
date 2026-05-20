package com.jenugumpu.app.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.automirrored.filled.TrendingUp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.jenugumpu.app.localization.StringKeys
import com.jenugumpu.app.localization.t
import com.jenugumpu.app.model.Harvest
import com.jenugumpu.app.ui.components.AppTopBar
import com.jenugumpu.app.ui.components.JenuGumpuBottomBar
import com.jenugumpu.app.ui.navigation.Screen
import com.jenugumpu.app.ui.theme.*
import com.jenugumpu.app.ui.viewmodel.LocalMainViewModel
import com.jenugumpu.app.ui.viewmodel.LocalUserViewModel
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.TimeUnit

@Composable
fun DashboardScreen(navController: NavController) {
    val mainViewModel = LocalMainViewModel.current
    val userViewModel = LocalUserViewModel.current
    val authState by userViewModel.authState.collectAsStateWithLifecycle()
    val harvests by mainViewModel.harvests.collectAsStateWithLifecycle()
    val recentHarvests = harvests.take(5)
    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(authState.successMessage) {
        authState.successMessage?.let { message ->
            snackbarHostState.showSnackbar(message)
            userViewModel.clearAuthSuccess()
        }
    }

    Scaffold(
        topBar = {
            AppTopBar(
                onProfileClick = { navController.navigate(Screen.Profile.route) },
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) },
        bottomBar = { JenuGumpuBottomBar(navController) },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { navController.navigate(Screen.AddHarvest.route) },
                containerColor = BrandPrimary,
                contentColor = Color.White,
                shape = CircleShape
            ) {
                Icon(Icons.Default.Add, contentDescription = t(StringKeys.ADD_HARVEST))
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = t(StringKeys.WELCOME_BACK_EXCLAIM),
                    fontSize = 28.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = BrandPrimary,
                    letterSpacing = (-0.5).sp
                )
                Text(
                    text = t(StringKeys.HONEY_FARMER_DASHBOARD),
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)
                )
                Spacer(modifier = Modifier.height(24.dp))
            }

            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(32.dp),
                    colors = CardDefaults.cardColors(containerColor = BrandPrimary),
                    elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(28.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                t(StringKeys.TOTAL_HONEY_HARVESTED),
                                color = Color.White.copy(alpha = 0.8f),
                                fontWeight = FontWeight.Medium,
                                fontSize = 14.sp
                            )
                            Icon(
                                Icons.AutoMirrored.Filled.TrendingUp,
                                contentDescription = null,
                                tint = Color.White.copy(alpha = 0.5f),
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            mainViewModel.formattedTotalYield(),
                            fontSize = 42.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White,
                            lineHeight = 44.sp
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Surface(
                            color = Color.White.copy(alpha = 0.2f),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text(
                                t(StringKeys.PERCENT_FROM_LAST_MONTH),
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                                color = Color.White,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }

            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = t(StringKeys.RECENT_ACTIVITY),
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = OnBrandSurface
                    )
                    TextButton(onClick = { navController.navigate(Screen.HarvestLog.route) }) {
                        Text(t(StringKeys.VIEW_ALL), color = BrandSecondary, fontWeight = FontWeight.Bold)
                    }
                }
            }

            if (recentHarvests.isEmpty()) {
                item {
                    Text(
                        text = t(StringKeys.ADD_HARVEST),
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(vertical = 8.dp),
                    )
                }
            } else {
                items(recentHarvests, key = { it.id }) { harvest ->
                    DashboardHarvestRow(
                        harvest = harvest,
                        mainViewModel = mainViewModel,
                    )
                }
            }
        }
    }
}

@Composable
private fun DashboardHarvestRow(
    harvest: Harvest,
    mainViewModel: com.jenugumpu.app.ui.viewmodel.MainViewModel,
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = BorderStroke(1.dp, Color.Black.copy(alpha = 0.05f))
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .background(BrandPrimary.copy(alpha = 0.1f), RoundedCornerShape(12.dp))
            )
            Column {
                Text(mainViewModel.harvestBatchLabel(harvest), fontWeight = FontWeight.Bold)
                Text(
                    harvestedAgoLabel(harvest.harvestedAtMillis),
                    fontSize = 12.sp,
                    color = Color.Gray,
                )
            }
        }
    }
}

private fun harvestedAgoLabel(harvestedAtMillis: Long): String {
    val diffMs = (System.currentTimeMillis() - harvestedAtMillis).coerceAtLeast(0L)
    val minutes = TimeUnit.MILLISECONDS.toMinutes(diffMs)
    return when {
        minutes < 1 -> "Just now"
        minutes < 60 -> "$minutes min ago"
        minutes < 24 * 60 -> "${minutes / 60} hours ago"
        else -> SimpleDateFormat("MMM d, h:mm a", Locale.getDefault()).format(Date(harvestedAtMillis))
    }
}
