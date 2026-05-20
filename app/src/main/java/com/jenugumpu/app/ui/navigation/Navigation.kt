package com.jenugumpu.app.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.jenugumpu.app.ui.screens.*

sealed class Screen(val route: String) {
    object Splash : Screen("splash")
    object Login : Screen("login")
    object Register : Screen("register")
    object VerifyOTP : Screen("verify_otp?phone={phone}&name={name}") {
        fun createRoute(phone: String, name: String = ""): String {
            val encodedPhone = phone.filter { it.isDigit() }
            val encodedName = name.trim()
            return "verify_otp?phone=$encodedPhone&name=${android.net.Uri.encode(encodedName)}"
        }
    }
    object Dashboard : Screen("dashboard")
    object HarvestLog : Screen("harvest_log")
    object AddHarvest : Screen("add_harvest")
    object HoneyGrading : Screen("honey_grading")
    object Stock : Screen("stock")
    object Profile : Screen("profile")
    object OfflineMode : Screen("offline_mode")
    object Reports : Screen("reports")
    object Settings : Screen("settings")
    object Language : Screen("language")
    object ProfileEdit : Screen("profile_edit")
    object Error404 : Screen("error_404")
    object Error500 : Screen("error_500")
    object NoConnection : Screen("no_connection")
}

@Composable
fun JenuGumpuNavHost() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = Screen.Splash.route) {
        composable(Screen.Splash.route) { SplashScreen(navController) }
        composable(Screen.Login.route) { LoginScreen(navController) }
        composable(Screen.Register.route) { RegisterScreen(navController) }
        composable(
            route = Screen.VerifyOTP.route,
            arguments = listOf(
                navArgument("phone") {
                    type = NavType.StringType
                    defaultValue = ""
                },
                navArgument("name") {
                    type = NavType.StringType
                    defaultValue = ""
                },
            ),
        ) { backStackEntry ->
            val phone = backStackEntry.arguments?.getString("phone").orEmpty()
            val name = backStackEntry.arguments?.getString("name").orEmpty()
            VerifyOTPScreen(
                navController = navController,
                phone = phone,
                pendingName = name,
            )
        }
        composable(Screen.Dashboard.route) { DashboardScreen(navController) }
        composable(Screen.HarvestLog.route) { HarvestLogScreen(navController) }
        composable(Screen.AddHarvest.route) { AddHarvestScreen(navController) }
        composable(Screen.HoneyGrading.route) { HoneyGradingScreen(navController) }
        composable(Screen.Stock.route) { StockScreen(navController) }
        composable(Screen.Profile.route) { ProfileScreen(navController) }
        composable(Screen.OfflineMode.route) { OfflineModeScreen(navController) }
        composable(Screen.Reports.route) { ReportsScreen(navController) }
        composable(Screen.Settings.route) { SettingsScreen(navController) }
        composable(Screen.Language.route) { LanguageScreen(navController) }
        composable(Screen.ProfileEdit.route) { ProfileEditScreen(navController) }
        composable(Screen.Error404.route) { Error404Screen(navController) }
        composable(Screen.Error500.route) { Error500Screen(navController) }
        composable(Screen.NoConnection.route) { NoConnectionScreen(navController) }
    }
}
