package com.jenugumpu.app.auth

object CredentialValidator {

    private val phoneDigitsRegex = Regex("^[6-9]\\d{9}$")
    private val nameRegex = Regex("^\\p{L}[\\p{L}\\s'.-]{1,63}$")

    fun validatePhone(raw: String): ValidationResult {
        var digits = raw.filter { it.isDigit() }
        when {
            digits.length == 12 && digits.startsWith("91") -> digits = digits.drop(2)
            digits.length == 11 && digits.startsWith("0") -> digits = digits.drop(1)
        }
        return when {
            digits.isEmpty() -> ValidationResult.Invalid(ValidationError.PhoneRequired)
            digits.length != 10 || !phoneDigitsRegex.matches(digits) ->
                ValidationResult.Invalid(ValidationError.PhoneInvalid)
            else -> ValidationResult.Valid(digits)
        }
    }

    fun validateName(raw: String): ValidationResult {
        val trimmed = raw.trim()
        return when {
            trimmed.isEmpty() -> ValidationResult.Invalid(ValidationError.NameRequired)
            trimmed.length < 2 || !nameRegex.matches(trimmed) ->
                ValidationResult.Invalid(ValidationError.NameInvalid)
            else -> ValidationResult.Valid(trimmed)
        }
    }

    fun validateOtp(raw: String): ValidationResult {
        val digits = raw.filter { it.isDigit() }
        return when {
            digits.length != 6 -> ValidationResult.Invalid(ValidationError.OtpInvalid)
            else -> ValidationResult.Valid(digits)
        }
    }

    fun phoneToEmail(digits: String): String = "user+$digits@jenugumpu.app"
}

sealed class ValidationResult {
    data class Valid(val normalized: String) : ValidationResult()
    data class Invalid(val error: ValidationError) : ValidationResult()
}

enum class ValidationError {
    PhoneRequired,
    PhoneInvalid,
    NameRequired,
    NameInvalid,
    OtpInvalid,
}
