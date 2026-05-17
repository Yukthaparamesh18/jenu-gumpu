package com.jenugumpu.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
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
import com.jenugumpu.app.ui.navigation.Screen
import com.jenugumpu.app.ui.theme.BrandPrimary

@Composable
fun Error404Screen(navController: NavController) {
    val s = appStrings()

    Box(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text("404", fontSize = 80.sp, fontWeight = FontWeight.Black, color = BrandPrimary.copy(alpha = 0.1f))
            Text(s.error404Title, fontSize = 24.sp, fontWeight = FontWeight.Bold)
            Text(s.error404Subtitle, color = Color.Gray, modifier = Modifier.padding(top = 8.dp, bottom = 32.dp))

            Button(
                onClick = { navController.navigate(Screen.Dashboard.route) },
                modifier = Modifier.fillMaxWidth().height(56.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary)
            ) {
                Icon(Icons.Default.Home, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text(s.backToHome)
            }
        }
    }
}
