package com.jenugumpu.app.auth

import androidx.navigation.NavController
import com.jenugumpu.app.ui.navigation.Screen

fun NavController.navigateToDashboardClearingAuth() {
    navigate(Screen.Dashboard.route) {
        popUpTo(graph.startDestinationId) { inclusive = true }
        launchSingleTop = true
    }
}

fun NavController.navigateToVerifyOtp(phone: String, name: String = "") {
    navigate(Screen.VerifyOTP.createRoute(phone, name))
}
