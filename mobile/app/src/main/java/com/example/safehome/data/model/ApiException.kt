package com.example.safehome.data.model

data class ApiException(
    val code: Int,
    override val message: String
) : Exception(message)