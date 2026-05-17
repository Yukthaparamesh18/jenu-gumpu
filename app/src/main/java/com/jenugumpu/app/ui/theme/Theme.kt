package com.jenugumpu.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColorScheme = lightColorScheme(
    primary = BrandPrimary,
    onPrimary = Color.White,
    primaryContainer = BrandPrimaryContainer,
    onPrimaryContainer = OnBrandPrimaryContainer,
    secondary = BrandSecondary,
    onSecondary = Color.White,
    secondaryContainer = BrandSecondaryContainer,
    onSecondaryContainer = OnBrandSecondaryContainer,
    tertiary = BrandTertiary,
    onTertiary = Color.White,
    tertiaryContainer = BrandTertiaryContainer,
    onTertiaryContainer = OnBrandTertiaryContainer,
    background = BrandSurface,
    onBackground = OnBrandSurface,
    surface = BrandSurfaceLowest,
    onSurface = OnBrandSurface,
    surfaceVariant = BrandSurfaceLow,
    onSurfaceVariant = OnBrandSurfaceVariant,
    outline = BrandOutline,
    outlineVariant = BrandOutlineVariant
)

@Composable
fun JenuGumpuTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    // Forcing light theme as per UI design for now
    MaterialTheme(
        colorScheme = LightColorScheme,
        content = content
    )
}
