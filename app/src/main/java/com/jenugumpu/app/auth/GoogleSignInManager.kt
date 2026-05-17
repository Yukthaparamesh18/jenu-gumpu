package com.jenugumpu.app.auth

import android.util.Base64
import androidx.activity.ComponentActivity
import androidx.credentials.CredentialManager
import androidx.credentials.CustomCredential
import androidx.credentials.GetCredentialRequest
import androidx.credentials.exceptions.GetCredentialCancellationException
import androidx.credentials.exceptions.GetCredentialException
import androidx.credentials.exceptions.NoCredentialException
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import com.google.android.libraries.identity.googleid.GoogleIdTokenParsingException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject

data class GoogleAccount(
    val displayName: String,
    val email: String,
)

sealed class GoogleSignInOutcome {
    data class Success(val account: GoogleAccount) : GoogleSignInOutcome()
    data object Cancelled : GoogleSignInOutcome()
    data class Failure(val message: String) : GoogleSignInOutcome()
}

class GoogleSignInManager(
    private val webClientId: String,
) {
    private val isConfigured: Boolean
        get() = webClientId.isNotBlank() && !webClientId.startsWith("REPLACE_WITH")

    suspend fun signIn(activity: ComponentActivity): GoogleSignInOutcome = withContext(Dispatchers.IO) {
        if (!isConfigured) {
            return@withContext GoogleSignInOutcome.Failure(
                "Set google_web_client_id in res/values/values.xml to your OAuth Web client ID."
            )
        }

        val credentialManager = CredentialManager.create(activity)
        val googleIdOption = GetGoogleIdOption.Builder()
            .setFilterByAuthorizedAccounts(false)
            .setServerClientId(webClientId)
            .setAutoSelectEnabled(true)
            .build()

        val request = GetCredentialRequest.Builder()
            .addCredentialOption(googleIdOption)
            .build()

        try {
            val result = credentialManager.getCredential(
                context = activity,
                request = request,
            )
            val credential = result.credential
            if (credential !is CustomCredential ||
                credential.type != GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL
            ) {
                return@withContext GoogleSignInOutcome.Failure("Unexpected credential type")
            }

            val googleCredential = try {
                GoogleIdTokenCredential.createFrom(credential.data)
            } catch (e: GoogleIdTokenParsingException) {
                return@withContext GoogleSignInOutcome.Failure(e.message ?: "Failed to parse Google credential")
            }

            val displayName = googleCredential.displayName?.trim().orEmpty()
                .ifEmpty { googleCredential.givenName?.trim().orEmpty() }
                .ifEmpty { "Google User" }
            val email = extractEmailFromIdToken(googleCredential.idToken)
                ?: "${googleCredential.id}@google.jenugumpu.app"

            GoogleSignInOutcome.Success(
                GoogleAccount(
                    displayName = displayName,
                    email = email,
                )
            )
        } catch (_: GetCredentialCancellationException) {
            GoogleSignInOutcome.Cancelled
        } catch (_: NoCredentialException) {
            GoogleSignInOutcome.Failure("No Google account available on this device")
        } catch (e: GetCredentialException) {
            GoogleSignInOutcome.Failure(e.message ?: "Google sign-in failed")
        }
    }

    private fun extractEmailFromIdToken(idToken: String?): String? {
        if (idToken.isNullOrBlank()) return null
        val parts = idToken.split('.')
        if (parts.size < 2) return null
        return try {
            val payload = String(
                Base64.decode(parts[1], Base64.URL_SAFE or Base64.NO_WRAP or Base64.NO_PADDING),
                Charsets.UTF_8
            )
            JSONObject(payload).optString("email").takeIf { it.isNotBlank() }
        } catch (_: Exception) {
            null
        }
    }
}
