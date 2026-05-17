package com.jenugumpu.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.jenugumpu.app.auth.navigateToDashboardClearingAuth
import com.jenugumpu.app.auth.CredentialValidator
import com.jenugumpu.app.auth.ValidationResult
import com.jenugumpu.app.localization.appStrings
import com.jenugumpu.app.localization.validationMessage
import com.jenugumpu.app.ui.theme.BrandPrimary
import com.jenugumpu.app.ui.viewmodel.LocalUserViewModel

@Composable
fun VerifyOTPScreen(
    navController: NavController,
    phone: String,
    pendingName: String,
) {
    val s = appStrings()
    val userViewModel = LocalUserViewModel.current
    var otp by remember { mutableStateOf("") }
    var otpError by remember { mutableStateOf<String?>(null) }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background
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
                text = s.verifyOtp,
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                color = BrandPrimary
            )
            Text(
                text = s.otpSubtitle,
                fontSize = 16.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 8.dp, bottom = 48.dp)
            )

            OutlinedTextField(
                value = otp,
                onValueChange = {
                    otp = it.filter { ch -> ch.isDigit() }.take(6)
                    otpError = null
                },
                label = { Text(s.otpCode) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                isError = otpError != null,
                supportingText = otpError?.let { error -> { Text(error) } },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
                singleLine = true,
            )

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = {
                    when (val result = CredentialValidator.validateOtp(otp)) {
                        is ValidationResult.Valid -> {
                            val displayName = pendingName.trim().ifEmpty { "Honey Farmer" }
                            val email = CredentialValidator.phoneToEmail(phone)
                            userViewModel.signIn(
                                fullName = displayName,
                                email = email,
                            )
                            navController.navigateToDashboardClearingAuth()
                        }
                        is ValidationResult.Invalid -> {
                            otpError = s.validationMessage(result.error)
                        }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary)
            ) {
                Text(s.verify, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(16.dp))

            TextButton(onClick = { /* Resend code */ }) {
                Text(s.resendCode, color = MaterialTheme.colorScheme.secondary)
            }
        }
    }
}
