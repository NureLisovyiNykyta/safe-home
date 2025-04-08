package com.example.safehome.data.model

sealed class Result<out T> {
    data class Success<out T>(val data: T) : Result<T>()
    data class Error(val code: Int? = null, val message: String? = null) : Result<Nothing>()
    object Loading : Result<Nothing>()
}