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
        return when (val result = authRepository.isUserAuthorized(email, password)) {
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
        return when (val result = authRepository.isVerifyToken(localToken)) {
            is Result.Success -> {
                val isAuthorized = result.data.valid
                if (!isAuthorized) tokenRepository.clearToken()
                Result.Success(isAuthorized)
            }
            is Result.Error -> result
            is Result.Loading -> Result.Loading
        }
    }
}