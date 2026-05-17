package com.jenugumpu.app.ui.screens

import android.content.Intent
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.jenugumpu.app.localization.StringKeys
import com.jenugumpu.app.localization.t
import com.jenugumpu.app.model.HarvestStatus
import com.jenugumpu.app.report.HarvestSummaryData
import com.jenugumpu.app.report.PdfExportResult
import com.jenugumpu.app.report.PdfReportExporter
import com.jenugumpu.app.ui.components.JenuGumpuBottomBar
import com.jenugumpu.app.ui.theme.*
import com.jenugumpu.app.ui.viewmodel.LocalMainViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReportsScreen(navController: NavController) {
    val mainViewModel = LocalMainViewModel.current
    val harvests by mainViewModel.harvests.collectAsStateWithLifecycle()
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val snackbarHostState = remember { SnackbarHostState() }

    var isGenerating by remember { mutableStateOf(false) }
    var exportedReport by remember { mutableStateOf<PdfExportResult.Success?>(null) }

    val reports = listOf(
        t(StringKeys.MONTHLY_PRODUCTION_REPORT) to t(StringKeys.MONTHLY_PRODUCTION_REPORT_SUB),
        t(StringKeys.PROFIT_SUMMARY_REPORT) to t(StringKeys.PROFIT_SUMMARY_REPORT_SUB),
        t(StringKeys.STOCK_INVENTORY_REPORT) to t(StringKeys.STOCK_INVENTORY_REPORT_SUB),
    )

    exportedReport?.let { report ->
        AlertDialog(
            onDismissRequest = { exportedReport = null },
            title = { Text(t(StringKeys.REPORT_ACTIONS), fontWeight = FontWeight.Bold) },
            text = { Text("${t(StringKeys.PDF_SAVED_TO_DOWNLOADS)}\n${report.displayName}") },
            confirmButton = {
                TextButton(
                    onClick = {
                        val viewIntent = PdfReportExporter.createViewIntent(report.uri)
                        if (viewIntent.resolveActivity(context.packageManager) != null) {
                            context.startActivity(viewIntent)
                        } else {
                            scope.launch {
                                snackbarHostState.showSnackbar(
                                    mainViewModel.getTranslatedString(StringKeys.PDF_GENERATION_FAILED)
                                )
                            }
                        }
                        exportedReport = null
                    }
                ) {
                    Text(t(StringKeys.OPEN_REPORT), fontWeight = FontWeight.Bold, color = BrandPrimary)
                }
            },
            dismissButton = {
                TextButton(
                    onClick = {
                        val shareIntent = PdfReportExporter.createShareIntent(
                            uri = report.uri,
                            subject = mainViewModel.getTranslatedString(StringKeys.HARVEST_SUMMARY_REPORT_TITLE),
                        )
                        context.startActivity(
                            Intent.createChooser(shareIntent, mainViewModel.getTranslatedString(StringKeys.SHARE_REPORT))
                        )
                        exportedReport = null
                    }
                ) {
                    Text(t(StringKeys.SHARE_REPORT), fontWeight = FontWeight.Bold, color = BrandSecondary)
                }
            },
        )
    }

    fun generatePdfReport() {
        if (isGenerating) return

        val rows = HarvestSummaryData.fromHarvests(harvests) { status: HarvestStatus ->
            mainViewModel.harvestStatusLabel(status)
        }
        if (rows.isEmpty()) {
            scope.launch {
                snackbarHostState.showSnackbar(
                    mainViewModel.getTranslatedString(StringKeys.PDF_NO_HARVEST_DATA)
                )
            }
            return
        }

        scope.launch {
            isGenerating = true
            val generatedLabel = "${mainViewModel.getTranslatedString(StringKeys.PDF_GENERATED_ON)} ${
                SimpleDateFormat("MMM d, yyyy h:mm a", Locale.getDefault()).format(Date())
            }"
            val result = kotlinx.coroutines.withContext(Dispatchers.IO) {
                PdfReportExporter.generateHarvestSummaryPdf(
                    context = context,
                    title = mainViewModel.getTranslatedString(StringKeys.HARVEST_SUMMARY_REPORT_TITLE),
                    generatedLabel = generatedLabel,
                    totalLabel = mainViewModel.getTranslatedString(StringKeys.TOTAL_YIELD),
                    columnHeaders = listOf(
                        mainViewModel.getTranslatedString(StringKeys.PDF_COLUMN_BATCH),
                        mainViewModel.getTranslatedString(StringKeys.PDF_COLUMN_SOURCE),
                        mainViewModel.getTranslatedString(StringKeys.PDF_COLUMN_YIELD),
                        mainViewModel.getTranslatedString(StringKeys.PDF_COLUMN_STATUS),
                        mainViewModel.getTranslatedString(StringKeys.PDF_COLUMN_DATE),
                    ),
                    rows = rows,
                )
            }
            isGenerating = false
            when (result) {
                is PdfExportResult.Success -> exportedReport = result
                is PdfExportResult.Failure -> snackbarHostState.showSnackbar(
                    result.message.ifBlank { mainViewModel.getTranslatedString(StringKeys.PDF_GENERATION_FAILED) }
                )
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(t(StringKeys.REPORTS), fontWeight = FontWeight.Bold, color = BrandPrimary) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = t(StringKeys.BACK), tint = BrandPrimary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) },
        bottomBar = { JenuGumpuBottomBar(navController) }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Spacer(modifier = Modifier.height(24.dp))
                Text(t(StringKeys.AVAILABLE_REPORTS), fontSize = 20.sp, fontWeight = FontWeight.Bold, color = BrandSecondary)
            }

            items(reports.size) { i ->
                val (title, sub) = reports[i]
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Color.Black.copy(alpha = 0.05f))
                ) {
                    Row(
                        modifier = Modifier.padding(24.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier.size(48.dp).background(BrandPrimary.copy(alpha = 0.1f), RoundedCornerShape(12.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Description, contentDescription = null, tint = BrandPrimary)
                        }
                        Spacer(modifier = Modifier.width(16.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(title, fontWeight = FontWeight.Bold)
                            Text(sub, fontSize = 12.sp, color = Color.Gray)
                        }
                        Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Color.Gray)
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = { generatePdfReport() },
                    enabled = !isGenerating,
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary)
                ) {
                    if (isGenerating) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(22.dp),
                            color = Color.White,
                            strokeWidth = 2.dp,
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(t(StringKeys.GENERATE_PDF_REPORT), fontWeight = FontWeight.Bold)
                    } else {
                        Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(t(StringKeys.GENERATE_PDF_REPORT), fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
