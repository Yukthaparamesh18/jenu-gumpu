package com.jenugumpu.app.localization

import com.jenugumpu.app.auth.ValidationError

fun AppStrings.validationMessage(error: ValidationError): String = when (error) {
    ValidationError.PhoneRequired -> errorPhoneRequired
    ValidationError.PhoneInvalid -> errorPhoneInvalid
    ValidationError.NameRequired -> errorNameRequired
    ValidationError.NameInvalid -> errorNameInvalid
    ValidationError.OtpInvalid -> errorOtpInvalid
}
