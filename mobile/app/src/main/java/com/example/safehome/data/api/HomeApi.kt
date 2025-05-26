package com.example.safehome.data.api

import com.example.safehome.data.model.AddHomeRequest
import com.example.safehome.data.model.HomesResponse
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.DELETE
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.Headers

interface HomeApi {
    @GET("homes")
    @Headers(
        "Content-Type: application/json"
    )
    suspend fun getHomes(
        @Header("Authorization") token: String?
    ): HomesResponse

    /*@POST("homes")
    @Headers(
        "Content-Type: application/json"
    )
    suspend fun addHome(
        @Header("Authorization") token: String,
        @Body request: AddHomeRequest
    ): MessageResponse

    @DELETE("homes")
    @Headers(
        "Content-Type: application/json"
    )
    suspend fun deleteHome(
        @Header("Authorization") token: String,
        @Body request: DeleteRequest
    ): Response

    @POST("homes")
    @Headers(
        "Content-Type: application/json"
    )
    suspend fun archiveHome(
        @Header("Authorization") token: String,
        @Body request: ArchiveRequest
    ): Response

    @POST("homes")
    @Headers(
        "Content-Type: application/json"
    )
    suspend fun unArchiveHome(
        @Header("Authorization") token: String,
        @Body request: UnArchiveRequest
    ): Response

    @POST("homes")
    @Headers(
        "Content-Type: application/json"
    )
    suspend fun armedHome(
        @Header("Authorization") token: String,
        @Body request: ArmedRequest
    ): Response

    @POST("homes")
    @Headers(
        "Content-Type: application/json"
    )
    suspend fun disarmedHome(
        @Header("Authorization") token: String,
        @Body request: DisarmedRequest
    ): Response*/
}