package com.example.safehome.data.api

import com.example.safehome.data.model.ApiException
import okhttp3.Interceptor
import okhttp3.Response

class ErrorInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val response = chain.proceed(request)

        if (!response.isSuccessful) {
            val errorMessage = when (response.code) {
                400 -> "Bad Request"
                401 -> "Unauthorized - Invalid token"
                403 -> "Forbidden - Access denied"
                404 -> "Not Found"
                500 -> "Server Error"
                else -> "Unknown Error: ${response.code}"
            }
            throw ApiException(response.code, errorMessage)
        }
        return response
    }
}