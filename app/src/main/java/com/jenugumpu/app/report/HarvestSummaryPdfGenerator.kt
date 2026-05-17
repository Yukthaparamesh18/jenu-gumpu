package com.jenugumpu.app.report

import android.graphics.Paint
import android.graphics.Typeface
import android.graphics.pdf.PdfDocument
import java.io.OutputStream

class HarvestSummaryPdfGenerator {

    fun write(
        outputStream: OutputStream,
        title: String,
        generatedLabel: String,
        totalLabel: String,
        totalValue: String,
        columnHeaders: List<String>,
        rows: List<HarvestSummaryRow>,
    ) {
        val pageWidth = 595
        val pageHeight = 842
        val margin = 40f
        val rowHeight = 26f
        val tableWidth = pageWidth - (margin * 2)
        val columnWeights = floatArrayOf(0.14f, 0.24f, 0.16f, 0.18f, 0.28f)
        val columnWidths = columnWeights.map { it * tableWidth }

        val titlePaint = Paint().apply {
            textSize = 22f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            isAntiAlias = true
        }
        val subtitlePaint = Paint().apply {
            textSize = 11f
            color = 0xFF555555.toInt()
            isAntiAlias = true
        }
        val headerPaint = Paint().apply {
            textSize = 12f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            isAntiAlias = true
        }
        val cellPaint = Paint().apply {
            textSize = 11f
            isAntiAlias = true
        }
        val linePaint = Paint().apply {
            strokeWidth = 1f
            color = 0xFFCCCCCC.toInt()
        }
        val headerFillPaint = Paint().apply {
            color = 0xFFF5F0E8.toInt()
        }

        val pdfDocument = PdfDocument()
        var pageNumber = 1
        var page = pdfDocument.startPage(
            PdfDocument.PageInfo.Builder(pageWidth, pageHeight, pageNumber).create()
        )
        var canvas = page.canvas
        var y = margin

        fun drawRow(values: List<String>, top: Float, isHeader: Boolean) {
            if (isHeader) {
                canvas.drawRect(margin, top, margin + tableWidth, top + rowHeight, headerFillPaint)
            }
            var x = margin
            values.forEachIndexed { index, value ->
                val paint = if (isHeader) headerPaint else cellPaint
                canvas.drawText(value, x + 6f, top + 18f, paint)
                x += columnWidths[index]
            }
            canvas.drawLine(margin, top + rowHeight, margin + tableWidth, top + rowHeight, linePaint)
        }

        fun startNewPage(drawTableHeader: Boolean) {
            pdfDocument.finishPage(page)
            pageNumber++
            page = pdfDocument.startPage(
                PdfDocument.PageInfo.Builder(pageWidth, pageHeight, pageNumber).create()
            )
            canvas = page.canvas
            y = margin
            if (drawTableHeader) {
                drawRow(columnHeaders, y, isHeader = true)
                y += rowHeight
            }
        }

        canvas.drawText(title, margin, y, titlePaint)
        y += 28f
        canvas.drawText(generatedLabel, margin, y, subtitlePaint)
        y += 22f
        canvas.drawText("$totalLabel: $totalValue kg", margin, y, headerPaint)
        y += 28f

        drawRow(columnHeaders, y, isHeader = true)
        y += rowHeight

        rows.forEach { row ->
            if (y + rowHeight > pageHeight - margin) {
                startNewPage(drawTableHeader = true)
            }
            drawRow(
                listOf(
                    row.batchId,
                    row.floralSource,
                    row.yieldKg,
                    row.status,
                    row.harvestedOn,
                ),
                y,
                isHeader = false,
            )
            y += rowHeight
        }

        if (rows.isEmpty()) {
            val emptyPaint = cellPaint.apply { textSize = 12f }
            canvas.drawText("—", margin + 6f, y + 18f, emptyPaint)
        }

        pdfDocument.finishPage(page)
        pdfDocument.writeTo(outputStream)
        pdfDocument.close()
    }
}
