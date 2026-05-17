package com.jenugumpu.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.jenugumpu.app.localization.StringKeys
import com.jenugumpu.app.localization.t
import com.jenugumpu.app.ui.components.JenuGumpuBottomBar
import com.jenugumpu.app.ui.theme.BrandPrimary
import com.jenugumpu.app.ui.viewmodel.AddHarvestResult
import com.jenugumpu.app.ui.viewmodel.LocalMainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddHarvestScreen(navController: NavController) {
    val mainViewModel = LocalMainViewModel.current

    var yield by remember { mutableStateOf("") }
    var flora by remember { mutableStateOf("Wildflower") }
    var yieldError by remember { mutableStateOf<String?>(null) }
    var floraError by remember { mutableStateOf<String?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(t(StringKeys.ADD_NEW_HARVEST), fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = t(StringKeys.BACK))
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
            Text(t(StringKeys.HARVEST_DETAILS), fontSize = 20.sp, fontWeight = FontWeight.Bold)

            OutlinedTextField(
                value = yield,
                onValueChange = {
                    yield = it.filter { ch -> ch.isDigit() || ch == '.' }
                    yieldError = null
                },
                label = { Text(t(StringKeys.TOTAL_YIELD_KG)) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                isError = yieldError != null,
                supportingText = yieldError?.let { error -> { Text(error) } },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                singleLine = true,
            )

            OutlinedTextField(
                value = flora,
                onValueChange = {
                    flora = it
                    floraError = null
                },
                label = { Text(t(StringKeys.FLORAL_SOURCE)) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                isError = floraError != null,
                supportingText = floraError?.let { error -> { Text(error) } },
                singleLine = true,
            )

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = {
                    val yieldValue = yield.toDoubleOrNull()
                    when (mainViewModel.addHarvest(flora, yieldValue ?: 0.0)) {
                        AddHarvestResult.Success -> navController.popBackStack()
                        AddHarvestResult.InvalidYield -> {
                            yieldError = "Enter a valid yield greater than 0"
                        }
                        AddHarvestResult.InvalidFloralSource -> {
                            floraError = "Enter a floral source (at least 2 characters)"
                        }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary)
            ) {
                Text(t(StringKeys.CONFIRM_HARVEST), fontSize = 18.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}
