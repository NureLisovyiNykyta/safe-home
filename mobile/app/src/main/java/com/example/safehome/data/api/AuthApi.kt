package com.example.safehome.data.api

import com.example.safehome.data.model.TokenVerificationRequest
import com.example.safehome.data.model.VerifyTokenResponse
import com.example.safehome.data.model.LoginRequest
import com.example.safehome.data.model.TokenResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Headers
import retrofit2.http.POST

interface AuthApi {
    @POST("token_login")
    @Headers(
        "Content-Type: application/json"
    )
    suspend fun checkLogin(@Body request: LoginRequest): TokenResponse

    @GET("verify_token")
    @Headers(
        "Content-Type: application/json"
    )
    suspend fun checkToken(@Body request: TokenVerificationRequest): VerifyTokenResponse
}