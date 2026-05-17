package com.jenugumpu.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil3.compose.AsyncImage
import com.jenugumpu.app.localization.appStrings
import com.jenugumpu.app.ui.theme.BrandOutlineVariant
import com.jenugumpu.app.ui.theme.BrandPrimary
import com.jenugumpu.app.ui.viewmodel.LocalUserViewModel

@Composable
fun ProfileAvatar(
    modifier: Modifier = Modifier,
    size: Dp = 44.dp,
    showBorder: Boolean = true,
    onClick: (() -> Unit)? = null,
    contentDescription: String? = null,
) {
    val userViewModel = LocalUserViewModel.current
    val userState by userViewModel.uiState.collectAsStateWithLifecycle()
    val description = contentDescription ?: appStrings().profile

    val shapeModifier = modifier
        .size(size)
        .clip(CircleShape)
        .then(
            if (showBorder) {
                Modifier.border(1.dp, BrandOutlineVariant.copy(alpha = 0.5f), CircleShape)
            } else {
                Modifier
            }
        )
        .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier)

    Box(
        modifier = shapeModifier.background(BrandPrimary.copy(alpha = 0.08f)),
        contentAlignment = Alignment.Center,
    ) {
        val photoUri = userState.profilePhotoUri
        if (photoUri != null) {
            AsyncImage(
                model = photoUri,
                contentDescription = description,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop,
            )
        } else {
            Icon(
                imageVector = Icons.Default.Person,
                contentDescription = description,
                tint = BrandPrimary,
                modifier = Modifier.size(size * 0.55f),
            )
        }
    }
}
