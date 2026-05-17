package com.jenugumpu.app.model

data class Notification(
    val id: String,
    val message: String,
    val timestampMillis: Long = System.currentTimeMillis(),
)
