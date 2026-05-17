package com.jenugumpu.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import com.jenugumpu.app.model.Notification
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

class NotificationViewModel : ViewModel() {
    private val _notifications = MutableStateFlow(defaultNotifications())
    val notifications: StateFlow<List<Notification>> = _notifications.asStateFlow()

    fun clearAll() {
        _notifications.value = emptyList()
    }

    fun addNotification(notification: Notification) {
        _notifications.update { current ->
            listOf(notification) + current
        }
    }

    companion object {
        fun defaultNotifications(): List<Notification> = listOf(
            Notification(
                id = "1",
                message = "Harvest #42 synced",
                timestampMillis = System.currentTimeMillis() - 5 * 60_000,
            ),
            Notification(
                id = "2",
                message = "Batch #38 graded successfully",
                timestampMillis = System.currentTimeMillis() - 45 * 60_000,
            ),
            Notification(
                id = "3",
                message = "5 harvest logs pending sync",
                timestampMillis = System.currentTimeMillis() - 2 * 3_600_000,
            ),
            Notification(
                id = "4",
                message = "Monthly production report is ready",
                timestampMillis = System.currentTimeMillis() - 24 * 3_600_000,
            ),
        )
    }
}
