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
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.jenugumpu.app.auth.navigateToDashboardClearingAuth
import com.jenugumpu.app.localization.StringKeys
import com.jenugumpu.app.localization.t
import com.jenugumpu.app.ui.theme.BrandPrimary
import com.jenugumpu.app.ui.viewmodel.LocalMainViewModel
import com.jenugumpu.app.ui.viewmodel.LocalUserViewModel
import com.jenugumpu.app.ui.viewmodel.OtpVerificationResult

@Composable
fun VerifyOTPScreen(
    navController: NavController,
    phone: String,
    pendingName: String,
) {
    val mainViewModel = LocalMainViewModel.current
    val userViewModel = LocalUserViewModel.current
    val authState by userViewModel.authState.collectAsStateWithLifecycle()

    var otp by remember { mutableStateOf("") }
    var otpError by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(phone, pendingName) {
        if (userViewModel.authState.value.pendingPhone.isEmpty() && phone.isNotEmpty()) {
            userViewModel.requestPhoneLogin(phone, pendingName)
        }
    }

    LaunchedEffect(authState.isAuthenticated) {
        if (authState.isAuthenticated) {
            navController.navigateToDashboardClearingAuth()
        }
    }

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
                text = t(StringKeys.VERIFY_OTP),
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                color = BrandPrimary
            )
            Text(
                text = t(StringKeys.OTP_SUBTITLE),
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
                label = { Text(t(StringKeys.OTP_CODE)) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                isError = otpError != null,
                supportingText = otpError?.let { error -> { Text(error) } },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
                singleLine = true,
                enabled = !authState.isLoading,
            )

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = {
                    when (val verification = userViewModel.verifyPhoneOtp(otp)) {
                        OtpVerificationResult.Success -> otpError = null
                        is OtpVerificationResult.ValidationFailed -> {
                            otpError = mainViewModel.validationMessage(verification.error)
                        }
                    }
                },
                enabled = !authState.isLoading,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary)
            ) {
                if (authState.isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp),
                        color = MaterialTheme.colorScheme.onPrimary,
                        strokeWidth = 2.dp,
                    )
                } else {
                    Text(t(StringKeys.VERIFY), fontSize = 18.sp, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            TextButton(
                onClick = { /* Resend code */ },
                enabled = !authState.isLoading,
            ) {
                Text(t(StringKeys.RESEND_CODE), color = MaterialTheme.colorScheme.secondary)
            }
        }
    }
}
