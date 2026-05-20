package com.jenugumpu.app.model

import kotlinx.serialization.Serializable

@Serializable
enum class HarvestStatus {
    ACTIVE,
    PENDING_GRADING,
    GRADED,
    SYNCED,
}

@Serializable
data class Harvest(
    val id: Int,
    val floralSource: String,
    val yieldKg: Double,
    val price: Double = 0.0,
    val status: HarvestStatus = HarvestStatus.ACTIVE,
    val harvestedAtMillis: Long = System.currentTimeMillis(),
) {
    fun matchesSearch(query: String): Boolean {
        if (query.isBlank()) return true
        val normalized = query.trim()
        return id.toString().contains(normalized, ignoreCase = true) ||
            floralSource.contains(normalized, ignoreCase = true)
    }
}
