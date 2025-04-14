package com.example.safehome.data.repo

import com.example.safehome.data.api.AuthApi
import com.example.safehome.data.model.LoginRequest
import com.example.safehome.data.model.Result
import com.example.safehome.data.model.TokenResponse
import com.example.safehome.data.model.VerifyTokenResponse
import com.example.safehome.data.network.NetworkHandler
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepository @Inject constructor(
    private val authApi: AuthApi,
    private val networkHandler: NetworkHandler
) {
    suspend fun isUserAuthorized(email: String, password: String): Result<TokenResponse> {
        return networkHandler.safeApiCall {
            authApi.checkLogin(LoginRequest(email, password))
        }
    }

    suspend fun isVerifyToken(token: String): Result<VerifyTokenResponse> {
        return networkHandler.safeApiCall {
            authApi.checkToken(token)
        }
    }
}