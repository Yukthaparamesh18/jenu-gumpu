package com.jenugumpu.app.support

import android.content.Context
import android.content.Intent
import android.net.Uri
import com.jenugumpu.app.R

object SupportIntents {

    fun whatsAppSupportIntent(context: Context): Intent {
        val number = context.getString(R.string.support_whatsapp_number)
            .filter { it.isDigit() }
        return Intent(Intent.ACTION_VIEW, Uri.parse("https://wa.me/$number"))
    }
}
