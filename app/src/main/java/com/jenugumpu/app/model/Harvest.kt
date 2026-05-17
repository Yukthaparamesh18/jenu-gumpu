package com.jenugumpu.app.model

enum class HarvestStatus {
    ACTIVE,
    PENDING_GRADING,
    GRADED,
    SYNCED,
}

data class Harvest(
    val id: Int,
    val floralSource: String,
    val yieldKg: Double,
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
