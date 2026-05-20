package com.jenugumpu.app.auth

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.util.Log
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
        Log.d("GoogleSignIn", "parseResult called with resultCode: $resultCode")
        if (resultCode != Activity.RESULT_OK) {
            Log.w("GoogleSignIn", "Sign-in cancelled or failed. resultCode: $resultCode")
            return GoogleSignInOutcome.Cancelled
        }
        if (!isConfigured) {
            Log.e("GoogleSignIn", "Google Web Client ID is not configured!")
            return GoogleSignInOutcome.Failure(
                "Set google_web_client_id in res/values/values.xml to your OAuth Web client ID.",
            )
        }

        return try {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            val account = task.getResult(ApiException::class.java)

            val displayName = account.displayName?.trim().orEmpty()
                .ifEmpty { account.givenName?.trim().orEmpty() }
                .ifEmpty { "Google User" }
            val email = account.email?.trim().orEmpty()

            Log.d("GoogleSignIn", "Sign-in successful for email: $email, idToken exists: ${account.idToken != null}")

            if (email.isEmpty()) {
                Log.e("GoogleSignIn", "Google account did not return an email address.")
                GoogleSignInOutcome.Failure("Google account did not return an email address.")
            } else {
                GoogleSignInOutcome.Success(
                    GoogleAccount(
                        displayName = displayName,
                        email = email,
                        idToken = account.idToken,
                    ),
                )
            }
        } catch (e: ApiException) {
            Log.e("GoogleSignIn", "Google sign-in failed. StatusCode: ${e.statusCode}", e)
            GoogleSignInOutcome.Failure(e.message ?: "Google sign-in failed: ${e.statusCode}")
        } catch (e: Exception) {
            Log.e("GoogleSignIn", "Unexpected error during Google sign-in", e)
            GoogleSignInOutcome.Failure(e.message ?: "Unexpected error")
        }
    }

    fun signOut() {
        signInClient.signOut()
    }

    fun signOutAndSignIn(onIntentReady: (Intent) -> Unit) {
        signInClient.signOut().addOnCompleteListener {
            onIntentReady(signInClient.signInIntent)
        }
    }
}
