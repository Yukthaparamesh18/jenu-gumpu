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
import com.jenugumpu.app.auth.navigateToVerifyOtp
import com.jenugumpu.app.localization.StringKeys
import com.jenugumpu.app.localization.t
import com.jenugumpu.app.ui.navigation.Screen
import com.jenugumpu.app.ui.theme.BrandPrimary
import com.jenugumpu.app.ui.viewmodel.LocalMainViewModel
import com.jenugumpu.app.ui.viewmodel.LocalUserViewModel
import com.jenugumpu.app.ui.viewmodel.PhoneLoginRequest

@Composable
fun RegisterScreen(navController: NavController) {
    val mainViewModel = LocalMainViewModel.current
    val userViewModel = LocalUserViewModel.current
    val authState by userViewModel.authState.collectAsStateWithLifecycle()

    var name by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var nameError by remember { mutableStateOf<String?>(null) }
    var phoneError by remember { mutableStateOf<String?>(null) }

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
                text = t(StringKeys.JOIN_APP),
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                color = BrandPrimary
            )
            Text(
                text = t(StringKeys.REGISTER_SUBTITLE),
                fontSize = 16.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 8.dp, bottom = 48.dp)
            )

            OutlinedTextField(
                value = name,
                onValueChange = {
                    name = it
                    nameError = null
                },
                label = { Text(t(StringKeys.FULL_NAME)) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                isError = nameError != null,
                supportingText = nameError?.let { error -> { Text(error) } },
                singleLine = true,
                enabled = !authState.isLoading,
            )

            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = phone,
                onValueChange = {
                    phone = it.filter { ch -> ch.isDigit() || ch == '+' || ch == ' ' || ch == '-' }
                        .take(14)
                    phoneError = null
                },
                label = { Text(t(StringKeys.PHONE_NUMBER)) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                isError = phoneError != null,
                supportingText = phoneError?.let { error -> { Text(error) } },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                singleLine = true,
                enabled = !authState.isLoading,
            )

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = {
                    when (val request = userViewModel.requestPhoneLogin(phone, name)) {
                        is PhoneLoginRequest.ProceedToOtp -> {
                            nameError = null
                            phoneError = null
                            navController.navigateToVerifyOtp(
                                phone = request.phone,
                                name = request.name,
                            )
                        }
                        is PhoneLoginRequest.ValidationFailed -> {
                            when (request.error) {
                                com.jenugumpu.app.auth.ValidationError.NameRequired,
                                com.jenugumpu.app.auth.ValidationError.NameInvalid -> {
                                    nameError = mainViewModel.validationMessage(request.error)
                                }
                                else -> {
                                    phoneError = mainViewModel.validationMessage(request.error)
                                }
                            }
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
                Text(t(StringKeys.REGISTER), fontSize = 18.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(16.dp))

            TextButton(
                onClick = { navController.navigate(Screen.Login.route) },
                enabled = !authState.isLoading,
            ) {
                Text(t(StringKeys.ALREADY_HAVE_ACCOUNT), color = MaterialTheme.colorScheme.secondary)
            }
        }
    }
}
