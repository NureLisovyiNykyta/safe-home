package com.example.safehome.data.model

import java.io.IOException

data class ApiException(val code: Int, override val message: String)
    : IOException("HTTP $code: $message")