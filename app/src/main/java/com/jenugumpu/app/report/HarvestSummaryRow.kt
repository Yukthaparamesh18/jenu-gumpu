package com.jenugumpu.app.report

import com.jenugumpu.app.model.Harvest
import com.jenugumpu.app.model.HarvestStatus
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

data class HarvestSummaryRow(
    val batchId: String,
    val floralSource: String,
    val yieldKg: String,
    val status: String,
    val harvestedOn: String,
)

object HarvestSummaryData {

    private val dateFormat = SimpleDateFormat("MMM d, yyyy", Locale.getDefault())

    fun fromHarvests(
        harvests: List<Harvest>,
        statusLabel: (HarvestStatus) -> String,
    ): List<HarvestSummaryRow> = harvests.map { harvest ->
        HarvestSummaryRow(
            batchId = harvest.id.toString(),
            floralSource = harvest.floralSource,
            yieldKg = String.format(Locale.getDefault(), "%.1f", harvest.yieldKg),
            status = statusLabel(harvest.status),
            harvestedOn = dateFormat.format(Date(harvest.harvestedAtMillis)),
        )
    }

    fun totalYieldKg(rows: List<HarvestSummaryRow>): String {
        val total = rows.sumOf { it.yieldKg.toDoubleOrNull() ?: 0.0 }
        return String.format(Locale.getDefault(), "%.1f", total)
    }
}
