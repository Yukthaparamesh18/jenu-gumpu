package com.jenugumpu.app.ui.screens

import android.content.Intent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.PhotoLibrary
import androidx.compose.material.icons.filled.Save
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.jenugumpu.app.localization.appStrings
import com.jenugumpu.app.ui.components.ProfileAvatar
import com.jenugumpu.app.ui.theme.BrandPrimary
import com.jenugumpu.app.ui.viewmodel.LocalUserViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileEditScreen(navController: NavController) {
    val s = appStrings()
    val context = LocalContext.current
    val userViewModel = LocalUserViewModel.current
    val userState by userViewModel.uiState.collectAsStateWithLifecycle()

    var name by remember(userState.fullName) { mutableStateOf(userState.fullName) }
    var email by remember(userState.email) { mutableStateOf(userState.email) }
    var farmName by remember(userState.farmName) { mutableStateOf(userState.farmName) }
    var location by remember(userState.location) { mutableStateOf(userState.location) }

    val showPhotoSheet = remember { mutableStateOf(false) }
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    val pickPhotoLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia(),
    ) { uri ->
        uri?.let { selectedUri ->
            try {
                context.contentResolver.takePersistableUriPermission(
                    selectedUri,
                    Intent.FLAG_GRANT_READ_URI_PERMISSION,
                )
            } catch (_: SecurityException) {
                // Some providers do not support persistable permissions.
            }
            userViewModel.setProfilePhotoUri(selectedUri.toString())
        }
    }

    fun saveAndExit() {
        userViewModel.updateFullName(name)
        userViewModel.updateEmail(email)
        userViewModel.updateFarmName(farmName)
        userViewModel.updateLocation(location)
        userViewModel.saveProfile()
        navController.popBackStack()
    }

    if (showPhotoSheet.value) {
        ModalBottomSheet(
            onDismissRequest = { showPhotoSheet.value = false },
            sheetState = sheetState,
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp)
                    .padding(bottom = 32.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                Text(
                    text = s.changeProfilePhoto,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = BrandPrimary,
                    modifier = Modifier.padding(bottom = 8.dp),
                )

                SheetOption(
                    icon = Icons.Default.PhotoLibrary,
                    label = s.uploadNewPhoto,
                    onClick = {
                        showPhotoSheet.value = false
                        pickPhotoLauncher.launch(
                            PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                        )
                    },
                )

                if (userState.profilePhotoUri != null) {
                    SheetOption(
                        icon = Icons.Default.Delete,
                        label = s.removeCurrentPhoto,
                        onClick = {
                            userViewModel.removeProfilePhoto()
                            showPhotoSheet.value = false
                        },
                        tint = MaterialTheme.colorScheme.error,
                    )
                }
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(s.editProfile, fontWeight = FontWeight.Bold, color = BrandPrimary) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = s.back, tint = BrandPrimary)
                    }
                },
                actions = {
                    TextButton(onClick = { saveAndExit() }) {
                        Text(s.save, fontWeight = FontWeight.ExtraBold, color = BrandPrimary)
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
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Spacer(modifier = Modifier.height(8.dp))

            ProfileAvatar(
                size = 112.dp,
                showBorder = true,
                onClick = { showPhotoSheet.value = true },
            )

            Text(
                text = s.changeProfilePhoto,
                fontSize = 14.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(bottom = 8.dp),
            )

            Text(
                s.personalDetails,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Start),
            )

            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text(s.fullName) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text(s.emailAddress) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(4.dp))
            Text(
                s.farmInformation,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Start),
            )

            OutlinedTextField(
                value = farmName,
                onValueChange = { farmName = it },
                label = { Text(s.businessFarmName) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            OutlinedTextField(
                value = location,
                onValueChange = { location = it },
                label = { Text(s.location) },
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
                Text(s.updateInformation, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
private fun SheetOption(
    icon: ImageVector,
    label: String,
    onClick: () -> Unit,
    tint: Color = BrandPrimary,
) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Icon(imageVector = icon, contentDescription = null, tint = tint)
            Text(text = label, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurface)
        }
    }
}
