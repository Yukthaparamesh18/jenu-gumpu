package com.jenugumpu.app.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.compose.runtime.getValue
import androidx.navigation.NavController
import com.jenugumpu.app.localization.AppLanguage
import com.jenugumpu.app.localization.appStrings
import com.jenugumpu.app.ui.theme.BrandPrimary
import com.jenugumpu.app.ui.theme.OnBrandSurfaceVariant
import com.jenugumpu.app.ui.viewmodel.LocalSettingsViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LanguageScreen(navController: NavController) {
    val s = appStrings()
    val settingsViewModel = LocalSettingsViewModel.current
    val settingsState by settingsViewModel.uiState.collectAsStateWithLifecycle()
    var pendingLanguage by remember(settingsState.selectedLanguage) {
        mutableStateOf(settingsState.selectedLanguage)
    }
    val languages = AppLanguage.entries

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(s.language, fontWeight = FontWeight.Bold, color = BrandPrimary) },
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

            items(languages.size) { i ->
                val language = languages[i]
                val isSelected = language == pendingLanguage

                Card(
                    modifier = Modifier.fillMaxWidth().clickable { pendingLanguage = language },
                    shape = androidx.compose.foundation.shape.RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (isSelected) BrandPrimary.copy(alpha = 0.05f) else Color.White
                    ),
                    border = BorderStroke(
                        width = if (isSelected) 2.dp else 1.dp,
                        color = if (isSelected) BrandPrimary else Color.Black.copy(alpha = 0.05f)
                    )
                ) {
                    Row(
                        modifier = Modifier.padding(20.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = language.displayName,
                            fontSize = 18.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                            color = if (isSelected) BrandPrimary else OnBrandSurfaceVariant
                        )
                        if (isSelected) {
                            Icon(Icons.Default.CheckCircle, contentDescription = s.selected, tint = BrandPrimary)
                        }
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(32.dp))
                Button(
                    onClick = {
                        settingsViewModel.setLanguage(pendingLanguage)
                        navController.popBackStack()
                    },
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    shape = androidx.compose.foundation.shape.RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary)
                ) {
                    Text(s.applyLanguage, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
