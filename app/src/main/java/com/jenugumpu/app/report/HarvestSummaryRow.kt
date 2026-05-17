package com.jenugumpu.app.report

data class HarvestSummaryRow(
    val batchId: String,
    val floralSource: String,
    val yieldKg: String,
    val status: String,
    val harvestedOn: String,
)

object HarvestSummaryData {
    fun sampleRows(): List<HarvestSummaryRow> = listOf(
        HarvestSummaryRow("42", "Wildflower", "15.2", "Synced", "May 12, 2026"),
        HarvestSummaryRow("41", "Wildflower", "14.8", "Synced", "May 10, 2026"),
        HarvestSummaryRow("40", "Acacia", "12.5", "Pending", "May 08, 2026"),
        HarvestSummaryRow("39", "Multiflora", "16.1", "Synced", "May 05, 2026"),
        HarvestSummaryRow("38", "Wildflower", "13.9", "Graded", "May 03, 2026"),
        HarvestSummaryRow("37", "Sunflower", "11.4", "Synced", "May 01, 2026"),
    )

    fun totalYieldKg(rows: List<HarvestSummaryRow>): String {
        val total = rows.sumOf { it.yieldKg.toDoubleOrNull() ?: 0.0 }
        return String.format("%.1f", total)
    }
}
