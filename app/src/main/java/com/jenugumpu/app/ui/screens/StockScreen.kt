package com.jenugumpu.app.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
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
import com.jenugumpu.app.ui.components.AppTopBar
import com.jenugumpu.app.ui.components.JenuGumpuBottomBar
import com.jenugumpu.app.ui.theme.*
import com.jenugumpu.app.ui.viewmodel.LocalMainViewModel
import java.util.Locale

@Composable
fun StockScreen(navController: NavController) {
    val mainViewModel = LocalMainViewModel.current
    val harvests by mainViewModel.harvests.collectAsStateWithLifecycle()

    // Aggregate stock by floral source
    val stockByFlora = harvests.groupBy { it.floralSource }
        .mapValues { entry -> entry.value.sumOf { it.yieldKg } }
        .toList()
        .sortedByDescending { it.second }

    Scaffold(
        topBar = { AppTopBar(title = t(StringKeys.NAV_STOCK)) },
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
                Text(
                    t(StringKeys.STOCK_INVENTORY_REPORT),
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = BrandSecondary
                )
            }

            if (stockByFlora.isEmpty()) {
                item {
                    Box(modifier = Modifier.fillMaxWidth().padding(top = 48.dp), contentAlignment = Alignment.Center) {
                        Text("No stock items found", color = Color.Gray)
                    }
                }
            } else {
                items(stockByFlora) { (flora, weight) ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(24.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        border = BorderStroke(1.dp, Color.Black.copy(alpha = 0.05f))
                    ) {
                        Row(
                            modifier = Modifier.padding(24.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier.size(48.dp).background(BrandPrimary.copy(alpha = 0.1f), RoundedCornerShape(12.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Inventory2, contentDescription = null, tint = BrandPrimary)
                            }
                            Spacer(modifier = Modifier.width(16.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(flora, fontWeight = FontWeight.Bold)
                                Text("In Stock", fontSize = 12.sp, color = Color.Gray)
                            }
                            Text(
                                String.format(Locale.getDefault(), "%.1f kg", weight),
                                fontWeight = FontWeight.ExtraBold,
                                color = BrandPrimary,
                                fontSize = 18.sp
                            )
                        }
                    }
                }
            }
            
            item {
                Spacer(modifier = Modifier.height(80.dp))
            }
        }
    }
}
