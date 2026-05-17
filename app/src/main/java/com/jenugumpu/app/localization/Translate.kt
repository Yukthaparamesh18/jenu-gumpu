package com.jenugumpu.app.localization

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.jenugumpu.app.ui.viewmodel.LocalMainViewModel
import com.jenugumpu.app.ui.viewmodel.MainViewModel

@Composable
fun t(
    key: String,
    viewModel: MainViewModel = LocalMainViewModel.current,
): String {
    val language by viewModel.selectedLanguage.collectAsStateWithLifecycle()
    return viewModel.getTranslatedString(key)
}

@Composable
fun tWildflowerBatch(
    index: Int,
    viewModel: MainViewModel = LocalMainViewModel.current,
): String {
    viewModel.selectedLanguage.collectAsStateWithLifecycle()
    return viewModel.wildflowerBatchLabel(index)
}

@Composable
fun tBatchLabel(
    id: Int,
    viewModel: MainViewModel = LocalMainViewModel.current,
): String {
    viewModel.selectedLanguage.collectAsStateWithLifecycle()
    return viewModel.batchLabel(id)
}

@Composable
fun tBatchNumber(
    id: Int,
    viewModel: MainViewModel = LocalMainViewModel.current,
): String {
    viewModel.selectedLanguage.collectAsStateWithLifecycle()
    return viewModel.batchNumber(id)
}

@Composable
fun tPendingBatchLabel(
    index: Int,
    viewModel: MainViewModel = LocalMainViewModel.current,
): String {
    viewModel.selectedLanguage.collectAsStateWithLifecycle()
    return viewModel.pendingBatchLabel(index)
}
