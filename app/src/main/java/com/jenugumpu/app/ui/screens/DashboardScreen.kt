package com.jenugumpu.app.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.automirrored.filled.TrendingUp
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.jenugumpu.app.localization.appStrings
import com.jenugumpu.app.ui.components.AppTopBar
import com.jenugumpu.app.ui.components.JenuGumpuBottomBar
import com.jenugumpu.app.ui.navigation.Screen
import com.jenugumpu.app.ui.theme.*

@Composable
fun DashboardScreen(navController: NavController) {
    val s = appStrings()

    Scaffold(
        topBar = {
            AppTopBar(
                onProfileClick = { navController.navigate(Screen.Profile.route) },
            )
        },
        bottomBar = { JenuGumpuBottomBar(navController) },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { navController.navigate(Screen.AddHarvest.route) },
                containerColor = BrandPrimary,
                contentColor = Color.White,
                shape = CircleShape
            ) {
                Icon(Icons.Default.Add, contentDescription = s.addHarvest)
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
                    text = s.welcomeBackExclaim,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = BrandPrimary,
                    letterSpacing = (-0.5).sp
                )
                Text(
                    text = s.honeyFarmerDashboard,
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
                                s.totalHoneyHarvested,
                                color = Color.White.copy(alpha = 0.8f),
                                fontWeight = FontWeight.Medium,
                                fontSize = 14.sp
                            )
                            Icon(Icons.AutoMirrored.Filled.TrendingUp, contentDescription = null, tint = Color.White.copy(alpha = 0.5f))
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            "124.5 kg",
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
                                s.percentFromLastMonth,
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
                        text = s.recentActivity,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = OnBrandSurface
                    )
                    TextButton(onClick = { navController.navigate(Screen.HarvestLog.route) }) {
                        Text(s.viewAll, color = BrandSecondary, fontWeight = FontWeight.Bold)
                    }
                }
            }

            items(5) { i ->
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
                            Text(s.wildflowerBatchLabel(i), fontWeight = FontWeight.Bold)
                            Text(s.harvestedAgo, fontSize = 12.sp, color = Color.Gray)
                        }
                    }
                }
            }
        }
    }
}
