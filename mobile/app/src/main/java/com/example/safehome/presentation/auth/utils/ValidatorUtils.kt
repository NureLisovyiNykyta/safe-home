package com.example.safehome.presentation.auth.utils

object ValidatorUtils {
    fun isValidEmail(email: String): Boolean {
        return email.isNotBlank() && android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()
    }

    fun isValidPassword(password: String): Boolean {
        return password.length >= 8
    }

    fun isNotBlank(vararg values: String): Boolean {
        return values.all { it.isNotBlank() }
    }
}
