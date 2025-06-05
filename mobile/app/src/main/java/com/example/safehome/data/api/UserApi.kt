package com.example.safehome.data.api

import com.example.safehome.data.model.GetUserResponse
import com.example.safehome.data.model.MessageResponse
import com.example.safehome.data.model.UpdatePasswordRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Headers
import retrofit2.http.PUT

interface UserApi {
    @GET("user")
    @Headers(
        "Content-Type: application/json"
    )
    suspend fun getUser(
        @Header("Authorization") token: String?
    ): Response<GetUserResponse>

    @PUT("user/password")
    @Headers(
        "Content-Type: application/json"
    )
    suspend fun updatePassword(
        @Header("Authorization") token: String?,
        @Body request: UpdatePasswordRequest
    ): Response<MessageResponse>
}