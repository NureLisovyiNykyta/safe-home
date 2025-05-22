package com.example.safehome.domain

import com.example.safehome.data.model.ErrorType
import com.example.safehome.data.model.Result
import com.example.safehome.data.repo.AuthRepository
import com.example.safehome.data.repo.TokenRepository
import javax.inject.Inject

class AuthUseCase @Inject constructor(
    private val authRepository: AuthRepository,
    private val tokenRepository: TokenRepository
) {
    suspend fun isUserAuthorized(email: String, password: String): Result<Boolean> {
        return when (val result = authRepository.login(email, password)) {
            is Result.Success -> {
                val token = result.data.token
                tokenRepository.saveToken(token)
                Result.Success(token.isNotEmpty())
            }
            is Result.Error -> result
            is Result.Loading -> Result.Loading
        }
    }
    suspend fun firebaseGoogleAuth(firebaseToken: String): Result<Boolean> {
        return when (val result = authRepository.googleLogin(firebaseToken)) {
            is Result.Success -> {
                val token = result.data.token
                tokenRepository.saveToken(token)
                Result.Success(token.isNotEmpty())
            }
            is Result.Error -> result
            is Result.Loading -> Result.Loading
        }
    }
    suspend fun isTokenExpired(): Result<Boolean> {
        val localToken = tokenRepository.getToken() ?: return Result.Error(ErrorType.InternalError("Token is null"))
        return when (val result = authRepository.verifyToken(localToken)) {
            is Result.Success -> {
                val isAuthorized = result.data.valid
                Result.Success(isAuthorized)
            }
            is Result.Error -> {
                when (val error = result.errorType) {
                    is ErrorType.ServerError -> {
                        if (error.code == 401)
                            tokenRepository.clearToken()
                    }
                    is ErrorType.NetworkError -> error.message
                    is ErrorType.InternalError -> error.message
                }
                result
            }
            is Result.Loading -> Result.Loading
        }
    }
}