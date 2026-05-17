package com.jenugumpu.app.ui.screens

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.PhotoLibrary
import androidx.compose.material.icons.filled.Save
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.jenugumpu.app.localization.StringKeys
import com.jenugumpu.app.localization.t
import com.jenugumpu.app.ui.components.ProfileAvatar
import com.jenugumpu.app.ui.theme.BrandPrimary
import com.jenugumpu.app.ui.viewmodel.LocalUserViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileEditScreen(navController: NavController) {
    val userViewModel = LocalUserViewModel.current
    val userState by userViewModel.uiState.collectAsStateWithLifecycle()

    var name by remember(userState.fullName) { mutableStateOf(userState.fullName) }
    var email by remember(userState.email) { mutableStateOf(userState.email) }
    var farmName by remember(userState.farmName) { mutableStateOf(userState.farmName) }
    var location by remember(userState.location) { mutableStateOf(userState.location) }

    val pickPhotoLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent(),
    ) { uri ->
        userViewModel.setProfilePhotoUri(uri?.toString())
    }

    fun openGallery() {
        pickPhotoLauncher.launch("image/*")
    }

    fun saveAndExit() {
        userViewModel.updateFullName(name)
        userViewModel.updateEmail(email)
        userViewModel.updateFarmName(farmName)
        userViewModel.updateLocation(location)
        userViewModel.saveProfile()
        navController.popBackStack()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(t(StringKeys.EDIT_PROFILE), fontWeight = FontWeight.Bold, color = BrandPrimary) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = t(StringKeys.BACK), tint = BrandPrimary)
                    }
                },
                actions = {
                    TextButton(onClick = { saveAndExit() }) {
                        Text(t(StringKeys.SAVE), fontWeight = FontWeight.ExtraBold, color = BrandPrimary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 24.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Spacer(modifier = Modifier.height(8.dp))

            ProfileAvatar(
                size = 112.dp,
                showBorder = true,
                onClick = { openGallery() },
            )

            OutlinedButton(
                onClick = { openGallery() },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
            ) {
                Icon(Icons.Default.PhotoLibrary, contentDescription = null, tint = BrandPrimary)
                Spacer(modifier = Modifier.width(8.dp))
                Text(t(StringKeys.UPLOAD_NEW_PHOTO), fontWeight = FontWeight.SemiBold)
            }

            if (userState.profilePhotoUri != null) {
                OutlinedButton(
                    onClick = { userViewModel.removeProfilePhoto() },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = MaterialTheme.colorScheme.error,
                    ),
                ) {
                    Text(
                        t(StringKeys.REMOVE_PROFILE_PICTURE),
                        fontWeight = FontWeight.SemiBold,
                    )
                }
            }

            Text(
                t(StringKeys.PERSONAL_DETAILS),
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier
                    .align(Alignment.Start)
                    .padding(top = 8.dp),
            )

            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text(t(StringKeys.FULL_NAME)) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text(t(StringKeys.EMAIL_ADDRESS)) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(4.dp))
            Text(
                t(StringKeys.FARM_INFORMATION),
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Start),
            )

            OutlinedTextField(
                value = farmName,
                onValueChange = { farmName = it },
                label = { Text(t(StringKeys.BUSINESS_FARM_NAME)) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            OutlinedTextField(
                value = location,
                onValueChange = { location = it },
                label = { Text(t(StringKeys.LOCATION)) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(8.dp))

            Button(
                onClick = { saveAndExit() },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary)
            ) {
                Icon(Icons.Default.Save, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text(t(StringKeys.UPDATE_INFORMATION), fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}
