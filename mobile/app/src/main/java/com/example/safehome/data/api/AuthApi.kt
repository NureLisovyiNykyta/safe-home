package com.example.safehome.data.api

import com.example.safehome.data.model.ResetPasswordRequest
import com.example.safehome.data.model.ResetPasswordResponse
import com.example.safehome.data.model.SignUpResponse
import com.example.safehome.data.model.VerifyTokenResponse
import com.example.safehome.data.model.SignInRequest
import com.example.safehome.data.model.SignUpRequest
import com.example.safehome.data.model.SignInResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Headers
import retrofit2.http.POST

interface AuthApi {
    @POST("token_login")
    @Headers(
        "Content-Type: application/json"
    )
    suspend fun login(@Body request: SignInRequest): SignInResponse

    @GET("verify_token")
    @Headers(
        "Content-Type: application/json"
    )
    suspend fun checkToken(@Header("Authorization") token: String): VerifyTokenResponse

    @POST("register")
    @Headers(
        "Content-Type: application/json"
    )
    suspend fun signUp(@Body request: SignUpRequest): SignUpResponse

    @POST("reset_password")
    @Headers(
        "Content-Type: application/json"
    )
    suspend fun resetPassword(@Body request: ResetPasswordRequest): ResetPasswordResponse
}