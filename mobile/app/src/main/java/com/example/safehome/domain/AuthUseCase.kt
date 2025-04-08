package com.example.safehome.domain

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
            Result.Loading -> Result.Loading
        }
    }

    suspend fun isTokenExpired(token: String): Result<Boolean> {
        val localToken = tokenRepository.getToken()
        if (localToken != null) {
            return Result.Success(true)
        }
        return Result.Success(false)
    }
}