package com.jenugumpu.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.jenugumpu.app.auth.ValidationError
import com.jenugumpu.app.backend.SupabaseModule
import com.jenugumpu.app.localization.AppLanguage
import com.jenugumpu.app.localization.AppStrings
import com.jenugumpu.app.localization.LocalizationProvider
import com.jenugumpu.app.localization.StringKeys
import com.jenugumpu.app.localization.getString
import com.jenugumpu.app.model.Harvest
import com.jenugumpu.app.model.HarvestStatus
import io.github.jan.supabase.postgrest.from
import java.util.Locale
import kotlinx.serialization.Serializable
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

sealed class AddHarvestResult {
    data object Success : AddHarvestResult()
    data object InvalidYield : AddHarvestResult()
    data object InvalidFloralSource : AddHarvestResult()
    data class NetworkError(val message: String) : AddHarvestResult()
}

@Serializable
data class HarvestDto(
    val id: Int? = null,
    val flora: String? = null,
    val quantity: Double? = null,
    val price: Double? = null,
    val created_at: String? = null
)

class MainViewModel : ViewModel() {
    private val _selectedLanguage = MutableStateFlow(AppLanguage.ENGLISH)
    val selectedLanguage: StateFlow<AppLanguage> = _selectedLanguage.asStateFlow()

    private val _harvests = MutableStateFlow(defaultHarvests())
    val harvests: StateFlow<List<Harvest>> = _harvests.asStateFlow()

    private var nextHarvestId: Int = _harvests.value.maxOfOrNull { it.id }?.plus(1) ?: 1

    init {
        viewModelScope.launch {
            fetchHarvests()
        }
    }

    fun setLanguage(language: AppLanguage) {
        _selectedLanguage.value = language
    }

    fun getTranslatedString(key: String): String {
        return stringsForCurrentLanguage().getString(key)
    }

    fun totalYieldKg(): Double = _harvests.value.sumOf { it.yieldKg }

    fun pendingGradingCount(): Int =
        _harvests.value.count { it.status == HarvestStatus.PENDING_GRADING }

    suspend fun fetchHarvests() {
        try {
            android.util.Log.d("MainViewModel", "Fetching harvests from Supabase...")
            val dtos = SupabaseModule.client
                .from("harvests")
                .select()
                .decodeList<HarvestDto>()
            
            val fetchedHarvests = dtos.mapNotNull { dto ->
                if (dto.flora != null && dto.quantity != null) {
                    Harvest(
                        id = dto.id ?: (0..100000).random(),
                        floralSource = dto.flora,
                        yieldKg = dto.quantity,
                        price = dto.price ?: 0.0,
                        status = HarvestStatus.ACTIVE,
                        harvestedAtMillis = System.currentTimeMillis() // Could parse created_at here if needed
                    )
                } else null
            }
            
            android.util.Log.d("MainViewModel", "Successfully fetched ${fetchedHarvests.size} harvests.")
            _harvests.update { fetchedHarvests.sortedByDescending { it.id } }
        } catch (e: Exception) {
            android.util.Log.e("MainViewModel", "Error fetching harvests", e)
        }
    }

    suspend fun addHarvest(flora: String, quantity: Double, price: Double): AddHarvestResult {
        val trimmedFlora = flora.trim()
        if (trimmedFlora.length < 2) {
            return AddHarvestResult.InvalidFloralSource
        }
        if (quantity <= 0.0) {
            return AddHarvestResult.InvalidYield
        }

        // 1. Add locally first (Optimistic update / Offline fallback)
        val localHarvest = Harvest(
            id = nextHarvestId++,
            floralSource = trimmedFlora,
            yieldKg = quantity,
            price = price,
            status = HarvestStatus.ACTIVE,
            harvestedAtMillis = System.currentTimeMillis()
        )
        _harvests.update { listOf(localHarvest) + it }
        android.util.Log.d("MainViewModel", "Added harvest locally: $localHarvest")

        // 2. Synchronize with Supabase
        return try {
            SupabaseModule.client
                .from("harvests")
                .insert(HarvestDto(flora = trimmedFlora, quantity = quantity, price = price))

            android.util.Log.d("MainViewModel", "Successfully synced harvest with Supabase.")
            // Refresh from DB to align IDs and timestamps
            try {
                fetchHarvests()
            } catch (fetchEx: Exception) {
                android.util.Log.w("MainViewModel", "Failed to fetch harvests after insert", fetchEx)
            }
            AddHarvestResult.Success
        } catch (e: Exception) {
            android.util.Log.e("MainViewModel", "Failed to sync harvest with Supabase", e)
            // Return NetworkError but the harvest is already saved locally!
            AddHarvestResult.NetworkError(e.message ?: "Sync failed, saved locally")
        }
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

    private fun formatKg(kg: Double): String = String.format(Locale.getDefault(), "%.1f kg", kg)

    private fun stringsForCurrentLanguage(): AppStrings =
        LocalizationProvider.strings(_selectedLanguage.value)

    companion object {
        private fun defaultHarvests(): List<Harvest> = listOf(
            Harvest(100, "Wildflower", 15.2, 250.0, HarvestStatus.ACTIVE),
            Harvest(99, "Wildflower", 14.8, 250.0, HarvestStatus.ACTIVE),
            Harvest(98, "Acacia", 12.5, 300.0, HarvestStatus.PENDING_GRADING),
            Harvest(97, "Multiflora", 16.1, 220.0, HarvestStatus.ACTIVE),
            Harvest(96, "Wildflower", 13.9, 250.0, HarvestStatus.PENDING_GRADING),
            Harvest(95, "Sunflower", 11.4, 180.0, HarvestStatus.ACTIVE),
            Harvest(94, "Wildflower", 15.0, 250.0, HarvestStatus.ACTIVE),
            Harvest(93, "Lavender", 10.8, 450.0, HarvestStatus.ACTIVE),
            Harvest(92, "Acacia", 14.2, 300.0, HarvestStatus.PENDING_GRADING),
            Harvest(91, "Multiflora", 12.0, 220.0, HarvestStatus.ACTIVE),
        )
    }
}
