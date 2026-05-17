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
import com.jenugumpu.app.auth.navigateToVerifyOtp
import com.jenugumpu.app.auth.CredentialValidator
import com.jenugumpu.app.auth.ValidationResult
import com.jenugumpu.app.localization.appStrings
import com.jenugumpu.app.localization.validationMessage
import com.jenugumpu.app.ui.navigation.Screen
import com.jenugumpu.app.ui.theme.BrandPrimary

@Composable
fun RegisterScreen(navController: NavController) {
    val s = appStrings()
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
                text = s.joinApp,
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                color = BrandPrimary
            )
            Text(
                text = s.registerSubtitle,
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
                label = { Text(s.fullName) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                isError = nameError != null,
                supportingText = nameError?.let { error -> { Text(error) } },
                singleLine = true,
            )

            Spacer(modifier = Modifier.height(16.dp))

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
                    val nameResult = CredentialValidator.validateName(name)
                    val phoneResult = CredentialValidator.validatePhone(phone)
                    var hasError = false

                    if (nameResult is ValidationResult.Invalid) {
                        nameError = s.validationMessage(nameResult.error)
                        hasError = true
                    } else {
                        nameError = null
                    }

                    if (phoneResult is ValidationResult.Invalid) {
                        phoneError = s.validationMessage(phoneResult.error)
                        hasError = true
                    } else {
                        phoneError = null
                    }

                    if (!hasError && nameResult is ValidationResult.Valid && phoneResult is ValidationResult.Valid) {
                        navController.navigateToVerifyOtp(
                            phone = phoneResult.normalized,
                            name = nameResult.normalized,
                        )
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary)
            ) {
                Text(s.register, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(16.dp))

            TextButton(onClick = { navController.navigate(Screen.Login.route) }) {
                Text(s.alreadyHaveAccount, color = MaterialTheme.colorScheme.secondary)
            }
        }
    }
}
