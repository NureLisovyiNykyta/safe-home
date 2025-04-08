package com.example.safehome.data.api

import com.example.safehome.data.model.AuthRequest
import com.example.safehome.data.model.TokenRequest
import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST

interface AuthApi {
    @POST("token_login")
    @Headers(
        "Content-Type: application/json"
    )
    suspend fun checkAuth(@Body request: AuthRequest): TokenRequest
}