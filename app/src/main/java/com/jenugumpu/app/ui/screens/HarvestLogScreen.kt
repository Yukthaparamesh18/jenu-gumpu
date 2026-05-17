package com.jenugumpu.app.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
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
import com.jenugumpu.app.localization.tBatchNumber
import com.jenugumpu.app.model.Harvest
import com.jenugumpu.app.ui.components.JenuGumpuBottomBar
import com.jenugumpu.app.ui.navigation.Screen
import com.jenugumpu.app.ui.theme.*
import com.jenugumpu.app.ui.viewmodel.LocalMainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HarvestLogScreen(navController: NavController) {
    val mainViewModel = LocalMainViewModel.current
    val harvests by mainViewModel.harvests.collectAsStateWithLifecycle()
    var searchQuery by remember { mutableStateOf("") }

    val filteredHarvests = remember(harvests, searchQuery) {
        mainViewModel.filterHarvests(searchQuery)
    }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text(t(StringKeys.HARVEST_LOG), fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = t(StringKeys.BACK))
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = Color.White)
            )
        },
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
                Spacer(modifier = Modifier.height(16.dp))
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text(t(StringKeys.SEARCH_BATCHES)) },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        unfocusedContainerColor = Color.White,
                        focusedContainerColor = Color.White
                    )
                )
            }

            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(32.dp),
                    colors = CardDefaults.cardColors(containerColor = BrandSecondary)
                ) {
                    Column(
                        modifier = Modifier.padding(28.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Surface(
                            color = Color.White.copy(alpha = 0.15f),
                            shape = CircleShape,
                            modifier = Modifier.size(64.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    Icons.Default.Star,
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier.size(32.dp)
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(20.dp))
                        Text(
                            t(StringKeys.READY_FOR_GRADING),
                            color = Color.White.copy(alpha = 0.7f),
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Medium
                        )
                        Text(
                            mainViewModel.pendingBatchesTitle(),
                            color = Color.White,
                            fontSize = 28.sp,
                            fontWeight = FontWeight.ExtraBold,
                            letterSpacing = (-0.5).sp
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                        Button(
                            onClick = { navController.navigate(Screen.HoneyGrading.route) },
                            colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                            shape = RoundedCornerShape(16.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(56.dp)
                        ) {
                            Text(
                                t(StringKeys.START_GRADING_NOW),
                                color = BrandSecondary,
                                fontWeight = FontWeight.ExtraBold,
                                fontSize = 14.sp,
                                letterSpacing = 1.sp
                            )
                        }
                    }
                }
            }

            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 24.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        t(StringKeys.BATCH_HISTORY),
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = OnBrandSurface
                    )
                    Surface(
                        color = BrandSurfaceHigh,
                        shape = CircleShape
                    ) {
                        Text(
                            "${filteredHarvests.size}",
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = OnBrandSurfaceVariant
                        )
                    }
                }
            }

            if (filteredHarvests.isEmpty()) {
                item {
                    Text(
                        text = if (searchQuery.isBlank()) {
                            t(StringKeys.BATCH_HISTORY)
                        } else {
                            "No batches match \"$searchQuery\""
                        },
                        modifier = Modifier.padding(vertical = 24.dp),
                        color = OnBrandSurfaceVariant,
                    )
                }
            } else {
                items(filteredHarvests, key = { it.id }) { harvest ->
                    HarvestLogRow(
                        harvest = harvest,
                        mainViewModel = mainViewModel,
                    )
                }
            }
        }
    }
}

@Composable
private fun HarvestLogRow(
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
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .background(BrandPrimary.copy(alpha = 0.1f), RoundedCornerShape(8.dp)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    tBatchNumber(harvest.id),
                    fontWeight = FontWeight.Bold,
                    color = BrandPrimary,
                )
            }
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(mainViewModel.harvestBatchLabel(harvest), fontWeight = FontWeight.Bold)
                Text(
                    mainViewModel.harvestWeightLabel(harvest),
                    fontSize = 12.sp,
                    color = Color.Gray,
                )
            }
            Text(
                mainViewModel.harvestStatusLabel(harvest.status),
                color = BrandSecondary,
                fontWeight = FontWeight.Bold,
                fontSize = 12.sp,
            )
        }
    }
}
