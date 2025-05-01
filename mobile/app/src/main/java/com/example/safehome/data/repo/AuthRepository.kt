package com.example.safehome.data.repo

import com.example.safehome.data.api.AuthApi
import com.example.safehome.data.model.ResetPasswordRequest
import com.example.safehome.data.model.ResetPasswordResponse
import com.example.safehome.data.model.Result
import com.example.safehome.data.model.SignInRequest
import com.example.safehome.data.model.SignInResponse
import com.example.safehome.data.model.SignUpRequest
import com.example.safehome.data.model.SignUpResponse
import com.example.safehome.data.model.VerifyTokenResponse
import com.example.safehome.data.network.NetworkHandler
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepository @Inject constructor(
    private val authApi: AuthApi,
    private val networkHandler: NetworkHandler
) {
    suspend fun login(email: String, password: String): Result<SignInResponse> {
        return networkHandler.safeApiCall {
            authApi.login(SignInRequest(email, password))
        }
    }

    suspend fun verifyToken(token: String): Result<VerifyTokenResponse> {
        return networkHandler.safeApiCall {
            authApi.checkToken(token)
        }
    }

    suspend fun register(name: String, email: String, password: String): Result<SignUpResponse> {
        return networkHandler.safeApiCall {
            authApi.signUp(SignUpRequest(name, email, password))
        }
    }

    suspend fun resetPassword(email: String): Result<ResetPasswordResponse> {
        return networkHandler.safeApiCall {
            authApi.resetPassword(ResetPasswordRequest(email))
        }
    }
}