package com.jenugumpu.app.ui.screens

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
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
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.jenugumpu.app.R
import kotlinx.coroutines.launch
import com.jenugumpu.app.auth.GoogleSignInActivityHelper
import com.jenugumpu.app.auth.navigateToDashboardClearingAuth
import com.jenugumpu.app.auth.navigateToVerifyOtp
import com.jenugumpu.app.localization.StringKeys
import com.jenugumpu.app.localization.t
import com.jenugumpu.app.ui.navigation.Screen
import com.jenugumpu.app.ui.theme.BrandPrimary
import com.jenugumpu.app.ui.viewmodel.LocalMainViewModel
import com.jenugumpu.app.ui.viewmodel.LocalUserViewModel
import com.jenugumpu.app.ui.viewmodel.PhoneLoginRequest

@Composable
fun LoginScreen(navController: NavController) {
    val mainViewModel = LocalMainViewModel.current
    val userViewModel = LocalUserViewModel.current
    val authState by userViewModel.authState.collectAsStateWithLifecycle()
    val context = LocalContext.current
    val googleSignInHelper = remember {
        GoogleSignInActivityHelper(
            context = context,
            webClientId = context.getString(R.string.google_web_client_id),
        )
    }

    val googleSignInLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult(),
    ) { result ->
        userViewModel.handleGoogleSignInOutcome(
            googleSignInHelper.parseResult(result.resultCode, result.data),
        )
    }

    var phone by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var phoneError by remember { mutableStateOf<String?>(null) }
    var emailError by remember { mutableStateOf<String?>(null) }
    var passwordError by remember { mutableStateOf<String?>(null) }
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    LaunchedEffect(authState.isAuthenticated) {
        if (authState.isAuthenticated) {
            navController.navigateToDashboardClearingAuth()
        }
    }

    LaunchedEffect(authState.errorMessage) {
        authState.errorMessage?.let { message ->
            snackbarHostState.showSnackbar(message)
            userViewModel.clearAuthError()
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
                text = t(StringKeys.WELCOME_BACK),
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                color = BrandPrimary
            )
            Text(
                text = t(StringKeys.SIGN_IN_SUBTITLE),
                fontSize = 16.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 8.dp, bottom = 32.dp)
            )

            OutlinedTextField(
                value = email,
                onValueChange = {
                    email = it
                    emailError = null
                },
                label = { Text(t(StringKeys.EMAIL_ADDRESS)) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                isError = emailError != null,
                supportingText = emailError?.let { error -> { Text(error) } },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                singleLine = true,
                enabled = !authState.isLoading,
            )

            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = password,
                onValueChange = {
                    password = it
                    passwordError = null
                },
                label = { Text("Password") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                isError = passwordError != null,
                supportingText = passwordError?.let { error -> { Text(error) } },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                singleLine = true,
                enabled = !authState.isLoading,
                visualTransformation = androidx.compose.ui.text.input.PasswordVisualTransformation(),
            )

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = {
                    if (email.isBlank()) {
                        emailError = "Email is required"
                        return@Button
                    }
                    if (password.isBlank()) {
                        passwordError = "Password is required"
                        return@Button
                    }
                    scope.launch {
                        userViewModel.loginUser(email, password)
                    }
                },
                enabled = !authState.isLoading,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary)
            ) {
                Text("Login", fontSize = 18.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(32.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                HorizontalDivider(modifier = Modifier.weight(1f))
                Text(
                    text = " OR ",
                    modifier = Modifier.padding(horizontal = 16.dp),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.outline
                )
                HorizontalDivider(modifier = Modifier.weight(1f))
            }

            Spacer(modifier = Modifier.height(32.dp))

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
                    when (val request = userViewModel.requestPhoneLogin(phone)) {
                        is PhoneLoginRequest.ProceedToOtp -> {
                            phoneError = null
                            navController.navigateToVerifyOtp(request.phone)
                        }
                        is PhoneLoginRequest.ValidationFailed -> {
                            phoneError = mainViewModel.validationMessage(request.error)
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
                Text(t(StringKeys.SEND_CODE), fontSize = 18.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(32.dp))

            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = Color.Black.copy(alpha = 0.05f),
                shape = RoundedCornerShape(16.dp),
                enabled = !authState.isLoading,
                onClick = {
                    if (authState.isLoading) return@Surface
                    userViewModel.setGoogleSignInLoading(true)
                    googleSignInHelper.signOutAndSignIn { intent ->
                        googleSignInLauncher.launch(intent)
                    }
                }
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    if (authState.isLoading) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(20.dp),
                            strokeWidth = 2.dp,
                            color = BrandPrimary,
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(t(StringKeys.SIGNING_IN), fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    } else {
                        Text(t(StringKeys.CONTINUE_WITH_GOOGLE), fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            TextButton(
                onClick = { navController.navigate(Screen.Register.route) },
                enabled = !authState.isLoading,
            ) {
                Text(t(StringKeys.NO_ACCOUNT_REGISTER), color = MaterialTheme.colorScheme.secondary)
            }
        }
    }
}
