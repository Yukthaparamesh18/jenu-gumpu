package com.jenugumpu.app.auth

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class CredentialValidatorTest {

    @Test
    fun validatePhone_acceptsTenDigitIndianMobile() {
        val result = CredentialValidator.validatePhone("9876543210")
        assertTrue(result is ValidationResult.Valid)
        assertEquals("9876543210", (result as ValidationResult.Valid).normalized)
    }

    @Test
    fun validatePhone_stripsFormatting() {
        val result = CredentialValidator.validatePhone("+91 98765 43210")
        assertTrue(result is ValidationResult.Valid)
        assertEquals("9876543210", (result as ValidationResult.Valid).normalized)
    }

    @Test
    fun validatePhone_rejectsShortNumber() {
        val result = CredentialValidator.validatePhone("12345")
        assertTrue(result is ValidationResult.Invalid)
    }

    @Test
    fun validateName_requiresMinimumLength() {
        val result = CredentialValidator.validateName("A")
        assertTrue(result is ValidationResult.Invalid)
    }

    @Test
    fun validateOtp_requiresSixDigits() {
        val result = CredentialValidator.validateOtp("12345")
        assertTrue(result is ValidationResult.Invalid)
    }
}
