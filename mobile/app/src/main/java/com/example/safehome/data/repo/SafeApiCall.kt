package com.example.safehome.data.repo

import com.example.safehome.data.model.ApiException
import com.example.safehome.data.model.Result

suspend fun <T> safeApiCall(call: suspend () -> T): Result<T> {
    return try {
        val result = call()
        Result.Success(result)
    } catch (e: ApiException) {
        Result.Error(code = e.code, message = "Error ${e.code}: ${e.message}")
    } catch (e: Exception) {
        Result.Error(message = "Unexpected error: ${e.message}")
    }
}