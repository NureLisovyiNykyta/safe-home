package com.example.safehome.data.repo

import com.example.safehome.data.api.AuthApi
import com.example.safehome.data.model.AuthRequest
import com.example.safehome.data.model.Result
import com.example.safehome.data.model.TokenRequest
import javax.inject.Inject

class AuthRepository @Inject constructor(
    private val authApi: AuthApi
) {

    suspend fun isUserAuthorized(email: String, password: String): Result<TokenRequest> {
        return safeApiCall {
            authApi.checkAuth(AuthRequest(email, password))
        }
    }
}