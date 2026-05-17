package com.jenugumpu.app.report

import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import androidx.core.content.FileProvider
import java.io.File
import java.io.FileOutputStream

sealed class PdfExportResult {
    data class Success(val uri: Uri, val displayName: String) : PdfExportResult()
    data class Failure(val message: String) : PdfExportResult()
}

object PdfReportExporter {

    private const val MIME_TYPE = "application/pdf"
    private const val CACHE_DIR = "reports"

    fun generateHarvestSummaryPdf(
        context: Context,
        title: String,
        generatedLabel: String,
        totalLabel: String,
        columnHeaders: List<String>,
        rows: List<HarvestSummaryRow>,
    ): PdfExportResult {
        return try {
            val displayName = "JenuGumpu_Harvest_Summary_${System.currentTimeMillis()}.pdf"
            val cacheFile = ensureCacheFile(context, displayName)

            FileOutputStream(cacheFile).use { output ->
                HarvestSummaryPdfGenerator().write(
                    outputStream = output,
                    title = title,
                    generatedLabel = generatedLabel,
                    totalLabel = totalLabel,
                    totalValue = HarvestSummaryData.totalYieldKg(rows),
                    columnHeaders = columnHeaders,
                    rows = rows,
                )
            }

            val downloadsUri = saveToDownloads(context, cacheFile, displayName)
                ?: return PdfExportResult.Failure("Could not save PDF to Downloads")

            PdfExportResult.Success(downloadsUri, displayName)
        } catch (e: Exception) {
            PdfExportResult.Failure(e.message ?: "Failed to generate PDF")
        }
    }

    fun createViewIntent(uri: Uri): Intent =
        Intent(Intent.ACTION_VIEW).apply {
            setDataAndType(uri, MIME_TYPE)
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }

    fun createShareIntent(uri: Uri, subject: String): Intent =
        Intent(Intent.ACTION_SEND).apply {
            type = MIME_TYPE
            putExtra(Intent.EXTRA_STREAM, uri)
            putExtra(Intent.EXTRA_SUBJECT, subject)
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }

    private fun ensureCacheFile(context: Context, displayName: String): File {
        val dir = File(context.cacheDir, CACHE_DIR)
        if (!dir.exists()) dir.mkdirs()
        return File(dir, displayName)
    }

    private fun saveToDownloads(context: Context, sourceFile: File, displayName: String): Uri? {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val values = ContentValues().apply {
                put(MediaStore.Downloads.DISPLAY_NAME, displayName)
                put(MediaStore.Downloads.MIME_TYPE, MIME_TYPE)
                put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
                put(MediaStore.Downloads.IS_PENDING, 1)
            }

            val resolver = context.contentResolver
            val collection = MediaStore.Downloads.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
            val uri = resolver.insert(collection, values) ?: return null

            resolver.openOutputStream(uri)?.use { output ->
                sourceFile.inputStream().use { input -> input.copyTo(output) }
            } ?: return null

            values.clear()
            values.put(MediaStore.Downloads.IS_PENDING, 0)
            resolver.update(uri, values, null, null)
            uri
        } else {
            @Suppress("DEPRECATION")
            val downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
            if (!downloadsDir.exists()) downloadsDir.mkdirs()
            val destFile = File(downloadsDir, displayName)
            sourceFile.inputStream().use { input ->
                FileOutputStream(destFile).use { output -> input.copyTo(output) }
            }
            FileProvider.getUriForFile(
                context,
                "${context.packageName}.fileprovider",
                destFile,
            )
        }
    }
}
