package com.jenugumpu.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import com.jenugumpu.app.auth.ValidationError
import com.jenugumpu.app.localization.AppLanguage
import com.jenugumpu.app.localization.AppStrings
import com.jenugumpu.app.localization.LocalizationProvider
import com.jenugumpu.app.localization.StringKeys
import com.jenugumpu.app.localization.getString
import com.jenugumpu.app.model.Harvest
import com.jenugumpu.app.model.HarvestStatus
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

sealed class AddHarvestResult {
    data object Success : AddHarvestResult()
    data object InvalidYield : AddHarvestResult()
    data object InvalidFloralSource : AddHarvestResult()
}

class MainViewModel : ViewModel() {
    private val _selectedLanguage = MutableStateFlow(AppLanguage.ENGLISH)
    val selectedLanguage: StateFlow<AppLanguage> = _selectedLanguage.asStateFlow()

    private val _harvests = MutableStateFlow(defaultHarvests())
    val harvests: StateFlow<List<Harvest>> = _harvests.asStateFlow()

    private var nextHarvestId: Int = _harvests.value.maxOfOrNull { it.id }?.plus(1) ?: 1

    fun setLanguage(language: AppLanguage) {
        _selectedLanguage.value = language
    }

    fun getTranslatedString(key: String): String {
        return stringsForCurrentLanguage().getString(key)
    }

    fun totalYieldKg(): Double = _harvests.value.sumOf { it.yieldKg }

    fun pendingGradingCount(): Int =
        _harvests.value.count { it.status == HarvestStatus.PENDING_GRADING }

    fun addHarvest(floralSource: String, yieldKg: Double): AddHarvestResult {
        val flora = floralSource.trim()
        if (flora.length < 2) {
            return AddHarvestResult.InvalidFloralSource
        }
        if (yieldKg <= 0.0) {
            return AddHarvestResult.InvalidYield
        }

        val harvest = Harvest(
            id = nextHarvestId++,
            floralSource = flora,
            yieldKg = yieldKg,
            status = HarvestStatus.ACTIVE,
            harvestedAtMillis = System.currentTimeMillis(),
        )

        _harvests.update { current -> listOf(harvest) + current }
        return AddHarvestResult.Success
    }

    fun validationMessage(error: ValidationError): String = when (error) {
        ValidationError.PhoneRequired -> getTranslatedString(StringKeys.ERROR_PHONE_REQUIRED)
        ValidationError.PhoneInvalid -> getTranslatedString(StringKeys.ERROR_PHONE_INVALID)
        ValidationError.NameRequired -> getTranslatedString(StringKeys.ERROR_NAME_REQUIRED)
        ValidationError.NameInvalid -> getTranslatedString(StringKeys.ERROR_NAME_INVALID)
        ValidationError.OtpInvalid -> getTranslatedString(StringKeys.ERROR_OTP_INVALID)
    }

    fun wildflowerBatchLabel(index: Int): String =
        stringsForCurrentLanguage().wildflowerBatchLabel(index)

    fun batchLabel(id: Int): String = stringsForCurrentLanguage().batchLabel(id)

    fun batchNumber(id: Int): String = stringsForCurrentLanguage().batchNumber(id)

    fun pendingBatchLabel(index: Int): String =
        stringsForCurrentLanguage().pendingBatchLabel(index)

    fun harvestBatchLabel(harvest: Harvest): String =
        "${harvest.floralSource} ${batchLabel(harvest.id)}"

    fun harvestWeightLabel(harvest: Harvest): String =
        "${harvest.floralSource} • ${formatKg(harvest.yieldKg)}"

    fun harvestStatusLabel(status: HarvestStatus): String = when (status) {
        HarvestStatus.ACTIVE -> getTranslatedString(StringKeys.ACTIVE)
        HarvestStatus.PENDING_GRADING -> getTranslatedString(StringKeys.READY_FOR_GRADING)
        HarvestStatus.GRADED -> "Graded"
        HarvestStatus.SYNCED -> "Synced"
    }

    fun pendingBatchesTitle(): String {
        val count = pendingGradingCount()
        val label = getTranslatedString(StringKeys.PENDING_BATCHES).replace(Regex("^\\d+\\s*"), "")
        return "$count $label"
    }

    fun filterHarvests(query: String): List<Harvest> {
        val trimmed = query.trim()
        if (trimmed.isEmpty()) return _harvests.value
        return _harvests.value.filter { it.matchesSearch(trimmed) }
    }

    fun recentHarvests(limit: Int = 5): List<Harvest> = _harvests.value.take(limit)

    fun formattedTotalYield(): String = formatKg(totalYieldKg())

    private fun formatKg(kg: Double): String = String.format("%.1f kg", kg)

    private fun stringsForCurrentLanguage(): AppStrings =
        LocalizationProvider.strings(_selectedLanguage.value)

    companion object {
        private fun defaultHarvests(): List<Harvest> = listOf(
            Harvest(100, "Wildflower", 15.2, HarvestStatus.ACTIVE),
            Harvest(99, "Wildflower", 14.8, HarvestStatus.ACTIVE),
            Harvest(98, "Acacia", 12.5, HarvestStatus.PENDING_GRADING),
            Harvest(97, "Multiflora", 16.1, HarvestStatus.ACTIVE),
            Harvest(96, "Wildflower", 13.9, HarvestStatus.PENDING_GRADING),
            Harvest(95, "Sunflower", 11.4, HarvestStatus.ACTIVE),
            Harvest(94, "Wildflower", 15.0, HarvestStatus.ACTIVE),
            Harvest(93, "Lavender", 10.8, HarvestStatus.ACTIVE),
            Harvest(92, "Acacia", 14.2, HarvestStatus.PENDING_GRADING),
            Harvest(91, "Multiflora", 12.0, HarvestStatus.ACTIVE),
        )
    }
}
