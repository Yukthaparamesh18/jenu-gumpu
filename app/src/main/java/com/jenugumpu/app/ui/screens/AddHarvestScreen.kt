package com.jenugumpu.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.jenugumpu.app.localization.appStrings
import com.jenugumpu.app.ui.components.JenuGumpuBottomBar

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddHarvestScreen(navController: NavController) {
    val s = appStrings()
    var yield by remember { mutableStateOf("") }
    var flora by remember { mutableStateOf("Wildflower") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(s.addNewHarvest, fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = s.back)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        },
        bottomBar = { JenuGumpuBottomBar(navController) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(24.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(s.harvestDetails, fontSize = 20.sp, fontWeight = FontWeight.Bold)

            OutlinedTextField(
                value = yield,
                onValueChange = { yield = it },
                label = { Text(s.totalYieldKg) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            OutlinedTextField(
                value = flora,
                onValueChange = { flora = it },
                label = { Text(s.floralSource) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = { navController.popBackStack() },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = com.jenugumpu.app.ui.theme.BrandPrimary)
            ) {
                Text(s.confirmHarvest, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}
