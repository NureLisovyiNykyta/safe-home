package com.example.safehome.data.repo

import com.example.safehome.data.api.AuthApi
import com.example.safehome.data.model.ErrorType
import com.example.safehome.data.model.ResetPasswordRequest
import com.example.safehome.data.model.ResetPasswordResponse
import com.example.safehome.data.model.Result
import com.example.safehome.data.model.SignInRequest
import com.example.safehome.data.model.SignUpRequest
import com.example.safehome.data.model.SignUpResponse
import com.example.safehome.data.network.NetworkHandler
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepository @Inject constructor(
    private val authApi: AuthApi,
    private val networkHandler: NetworkHandler,
    private val tokenRepository: TokenRepository,
) {
    suspend fun login(email: String, password: String): Result<Boolean> {
        val result = networkHandler.safeApiCall {
            authApi.login(SignInRequest(email, password))
        }

        return when (result) {
            is Result.Success -> {
                val token = result.data.token
                tokenRepository.saveToken(token)
                Result.Success(token.isNotEmpty())
            }
            is Result.Error -> result
            is Result.Loading -> Result.Loading
        }
    }

    suspend fun verifyToken(): Result<Boolean> {
        val token = tokenRepository.getToken() ?: return Result.Error(ErrorType.InternalError("No token available"))
        return when (val result = networkHandler.safeApiCall { authApi.checkToken(token) }) {
            is Result.Success -> {
                Result.Success(result.data.valid)
            }
            is Result.Error -> {
                if (result.errorType is ErrorType.ServerError && result.errorType.code == 401) {
                    tokenRepository.clearToken()
                }
                Result.Error(result.errorType)
            }
            is Result.Loading -> Result.Loading
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