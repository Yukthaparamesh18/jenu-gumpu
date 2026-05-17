package com.jenugumpu.app.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CloudOff
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.jenugumpu.app.localization.appStrings
import com.jenugumpu.app.ui.components.AppTopBar
import com.jenugumpu.app.ui.components.JenuGumpuBottomBar
import com.jenugumpu.app.ui.theme.*

@Composable
fun OfflineModeScreen(navController: NavController) {
    val s = appStrings()

    Scaffold(
        topBar = { AppTopBar() },
        bottomBar = { JenuGumpuBottomBar(navController) }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Spacer(modifier = Modifier.height(24.dp))
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(2.dp, BrandSurfaceHigh)
                ) {
                    Column(
                        modifier = Modifier.padding(32.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Box(
                            modifier = Modifier.size(80.dp).background(BrandPrimary.copy(alpha = 0.05f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.CloudOff, contentDescription = null, tint = BrandOutline.copy(alpha = 0.4f), modifier = Modifier.size(40.dp))
                        }
                        Text(s.offlineModeTitle, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                        Text(
                            s.offlineModeDescription,
                            textAlign = TextAlign.Center,
                            fontSize = 14.sp,
                            color = OnBrandSurfaceVariant
                        )
                        Surface(
                            shape = CircleShape,
                            color = BrandSecondaryContainer,
                            modifier = Modifier.padding(top = 8.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 24.dp, vertical = 8.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Refresh,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp),
                                    tint = OnBrandSecondaryContainer
                                )
                                Text(
                                    s.harvestLogsPendingSync,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = OnBrandSecondaryContainer
                                )
                            }
                        }
                    }
                }
            }

            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(s.specificRecordsWaiting, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = BrandSecondary)
                    Surface(shape = CircleShape, color = BrandSurfaceHigh) {
                        Text(s.itemsCount, modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            items(4) { i ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Color.Black.copy(alpha = 0.05f))
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier.size(48.dp).background(BrandPrimary.copy(alpha = 0.1f), RoundedCornerShape(12.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Refresh, contentDescription = null, tint = BrandPrimary)
                        }
                        Spacer(modifier = Modifier.width(16.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(s.pendingBatchLabel(i), fontWeight = FontWeight.Bold)
                            Text(s.harvestLogEntry, fontSize = 12.sp, color = Color.Gray)
                        }
                        Icon(Icons.Default.MoreVert, contentDescription = null, tint = Color.Gray)
                    }
                }
            }
        }
    }
}
