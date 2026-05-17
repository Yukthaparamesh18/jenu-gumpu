package com.jenugumpu.app.auth

import android.app.Activity
import android.content.Context
import android.content.Intent
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException

class GoogleSignInActivityHelper(
    context: Context,
    private val webClientId: String,
) {
    private val signInClient = GoogleSignIn.getClient(
        context,
        GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .requestProfile()
            .apply {
                if (isConfigured) {
                    requestIdToken(webClientId)
                }
            }
            .build(),
    )

    private val isConfigured: Boolean
        get() = webClientId.isNotBlank() && !webClientId.startsWith("REPLACE_WITH")

    val signInIntent: Intent
        get() = signInClient.signInIntent

    fun parseResult(resultCode: Int, data: Intent?): GoogleSignInOutcome {
        if (resultCode != Activity.RESULT_OK) {
            return GoogleSignInOutcome.Cancelled
        }
        if (!isConfigured) {
            return GoogleSignInOutcome.Failure(
                "Set google_web_client_id in res/values/values.xml to your OAuth Web client ID.",
            )
        }

        return try {
            val account = GoogleSignIn.getSignedInAccountFromIntent(data)
                .getResult(ApiException::class.java)

            val displayName = account.displayName?.trim().orEmpty()
                .ifEmpty { account.givenName?.trim().orEmpty() }
                .ifEmpty { "Google User" }
            val email = account.email?.trim().orEmpty()

            if (email.isEmpty()) {
                GoogleSignInOutcome.Failure("Google account did not return an email address.")
            } else {
                GoogleSignInOutcome.Success(
                    GoogleAccount(
                        displayName = displayName,
                        email = email,
                    ),
                )
            }
        } catch (e: ApiException) {
            GoogleSignInOutcome.Failure(e.message ?: "Google sign-in failed")
        }
    }

    fun signOut() {
        signInClient.signOut()
    }
}
