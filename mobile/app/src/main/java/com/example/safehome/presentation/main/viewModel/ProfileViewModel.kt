package com.example.safehome.presentation.main.viewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.safehome.data.api.AuthApi
import com.example.safehome.data.api.UserApi
import com.example.safehome.data.model.ErrorResponse
import com.example.safehome.data.model.GetUserResponse
import com.example.safehome.data.model.MessageResponse
import com.example.safehome.data.repo.TokenRepository
import com.google.gson.Gson
import com.google.gson.JsonSyntaxException
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class ProfileViewModel @Inject constructor(
    private var tokenRepository: TokenRepository,
    private val userApi: UserApi,
    private val authApi: AuthApi
) : ViewModel() {
    private val _userState = MutableStateFlow<GetUserResponse?>(null)
    val userState: StateFlow<GetUserResponse?> = _userState.asStateFlow()

    init {
        loadUser()
    }

    fun loadUser() {
        viewModelScope.launch {
            try {
                val token = tokenRepository.getToken()
                val response = userApi.getUser(token)

                if (response.isSuccessful) {
                    _userState.value = response.body()
                } else {
                    val errorBody = response.errorBody()?.string()
                    val errorMessage = try {
                        Gson().fromJson(errorBody, ErrorResponse::class.java).message
                    } catch (e: JsonSyntaxException) {
                        "Unknown error: $e"
                    }
                    _userState.value = null
                    Timber.tag("SensorViewModel").e(errorMessage)
                }
            } catch (e: Exception) {
                Timber.tag("SensorViewModel").e("Network error: ${e.message}")
            }
        }
    }

    suspend fun logout(): MessageResponse?{
        return try {
            val token = tokenRepository.getToken()
            if (token == null) {
                Timber.tag("ChangePswdViewModel").e("No token available")
                return MessageResponse("No token available")
            }

            val response = authApi.logout(token)

            if (response.isSuccessful) {
                response.body()
            } else {
                val errorBody = response.errorBody()?.string()
                val errorMessage = try {
                    Gson().fromJson(errorBody, ErrorResponse::class.java).error // Використовуємо error замість message
                } catch (e: JsonSyntaxException) {
                    Timber.tag("ChangePswdViewModel").e("Failed to parse error body: ${e.message}")
                    "Unknown error: ${e.message}"
                }
                Timber.tag("ChangePswdViewModel").e("Error ${response.code()}: $errorMessage")
                MessageResponse(errorMessage)
            }
        } catch (e: Exception) {
            Timber.tag("ChangePswdViewModel").e("Network error: ${e.message}")
            MessageResponse("Network error: ${e.message}")
        }
    }
}