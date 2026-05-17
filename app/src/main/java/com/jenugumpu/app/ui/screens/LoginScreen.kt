package com.jenugumpu.app.ui.screens

import androidx.activity.ComponentActivity
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.jenugumpu.app.R
import com.jenugumpu.app.auth.navigateToDashboardClearingAuth
import com.jenugumpu.app.auth.navigateToVerifyOtp
import com.jenugumpu.app.auth.CredentialValidator
import com.jenugumpu.app.auth.GoogleSignInManager
import com.jenugumpu.app.auth.GoogleSignInOutcome
import com.jenugumpu.app.auth.ValidationResult
import com.jenugumpu.app.localization.appStrings
import com.jenugumpu.app.localization.validationMessage
import com.jenugumpu.app.ui.navigation.Screen
import com.jenugumpu.app.ui.theme.BrandPrimary
import com.jenugumpu.app.ui.viewmodel.LocalUserViewModel
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(navController: NavController) {
    val s = appStrings()
    val userViewModel = LocalUserViewModel.current
    val context = LocalContext.current
    val activity = context as ComponentActivity
    val scope = rememberCoroutineScope()
    val googleSignInManager = remember {
        GoogleSignInManager(context.getString(R.string.google_web_client_id))
    }

    var phone by remember { mutableStateOf("") }
    var phoneError by remember { mutableStateOf<String?>(null) }
    var isGoogleLoading by remember { mutableStateOf(false) }
    var authMessage by remember { mutableStateOf<String?>(null) }
    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(authMessage) {
        authMessage?.let {
            snackbarHostState.showSnackbar(it)
            authMessage = null
        }
    }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        snackbarHost = { SnackbarHost(snackbarHostState) },
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = s.welcomeBack,
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                color = BrandPrimary
            )
            Text(
                text = s.signInSubtitle,
                fontSize = 16.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 8.dp, bottom = 48.dp)
            )

            OutlinedTextField(
                value = phone,
                onValueChange = {
                    phone = it.filter { ch -> ch.isDigit() || ch == '+' || ch == ' ' || ch == '-' }
                        .take(14)
                    phoneError = null
                },
                label = { Text(s.phoneNumber) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                isError = phoneError != null,
                supportingText = phoneError?.let { error -> { Text(error) } },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                singleLine = true,
            )

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = {
                    when (val result = CredentialValidator.validatePhone(phone)) {
                        is ValidationResult.Valid -> {
                            phoneError = null
                            navController.navigateToVerifyOtp(result.normalized)
                        }
                        is ValidationResult.Invalid -> {
                            phoneError = s.validationMessage(result.error)
                        }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary)
            ) {
                Text(s.sendCode, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(32.dp))

            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = Color.Black.copy(alpha = 0.05f),
                shape = RoundedCornerShape(16.dp),
                enabled = !isGoogleLoading,
                onClick = {
                    if (isGoogleLoading) return@Surface
                    scope.launch {
                        isGoogleLoading = true
                        when (val outcome = googleSignInManager.signIn(activity)) {
                            is GoogleSignInOutcome.Success -> {
                                userViewModel.signIn(
                                    fullName = outcome.account.displayName,
                                    email = outcome.account.email,
                                )
                                navController.navigateToDashboardClearingAuth()
                            }
                            GoogleSignInOutcome.Cancelled -> {
                                authMessage = s.googleSignInCancelled
                            }
                            is GoogleSignInOutcome.Failure -> {
                                authMessage = outcome.message.ifBlank { s.googleSignInFailed }
                            }
                        }
                        isGoogleLoading = false
                    }
                }
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    if (isGoogleLoading) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(20.dp),
                            strokeWidth = 2.dp,
                            color = BrandPrimary,
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(s.signingIn, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    } else {
                        Text(s.continueWithGoogle, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            TextButton(onClick = { navController.navigate(Screen.Register.route) }) {
                Text(s.noAccountRegister, color = MaterialTheme.colorScheme.secondary)
            }
        }
    }
}
