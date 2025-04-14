package com.example.safehome.data.model

sealed class ErrorType {
    data class InternalError(val message: String) : ErrorType()
    data class NetworkError(val message: String) : ErrorType()
    data class ServerError(val message: String, val code: Int) : ErrorType()
}