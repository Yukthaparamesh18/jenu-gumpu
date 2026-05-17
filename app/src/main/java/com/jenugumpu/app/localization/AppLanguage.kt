package com.jenugumpu.app.localization

enum class AppLanguage(val displayName: String) {
    ENGLISH("English"),
    KANNADA("ಕನ್ನಡ"),
    HINDI("हिन्दी"),
    TELUGU("తెలుగు"),
    TAMIL("தமிழ்"),
    MALAYALAM("മലയാളം");

    companion object {
        fun fromDisplayName(name: String): AppLanguage =
            entries.find { it.displayName == name } ?: ENGLISH
    }
}
