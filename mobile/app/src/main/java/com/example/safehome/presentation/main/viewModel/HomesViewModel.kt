package com.example.safehome.presentation.main.viewModel

import android.content.Context
import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.safehome.data.api.HomeApi
import com.example.safehome.data.model.AddHomeRequest
import com.example.safehome.data.model.HomeDto
import com.example.safehome.data.model.ErrorResponse
import com.example.safehome.data.repo.TokenRepository
import com.google.gson.Gson
import com.google.gson.JsonSyntaxException
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject
import timber.log.Timber


@HiltViewModel
class HomesViewModel @Inject constructor(
    @ApplicationContext private val context: Context,
    private var tokenRepository: TokenRepository,
    private val homeApi: HomeApi
) : ViewModel() {
    private val _homesState = MutableStateFlow<List<HomeDto>>(emptyList())
    val homesState: StateFlow<List<HomeDto>> = _homesState.asStateFlow()

    init {
        loadHomes()
    }

    fun loadHomes() {
        viewModelScope.launch {
            try {
                val token = tokenRepository.getToken()
                val response = homeApi.getHomes(token)

                if (response.isSuccessful) {
                    _homesState.value = response.body()?.homes!!
                } else {
                    val errorBody = response.errorBody()?.string()
                    val errorMessage = try {
                        Gson().fromJson(errorBody, ErrorResponse::class.java).message
                    } catch (e: JsonSyntaxException) {
                        "Unknown error: $e"
                    }
                    _homesState.value = emptyList()
                    Timber.tag("HomeViewModel").e(errorMessage)
                }
            } catch (e: Exception) {
                Timber.tag("HomeViewModel").e("Network error: ${e.message}")
            }
        }
    }

    fun addHome(name: String, address: String) {
        viewModelScope.launch {
            try {
                val token = tokenRepository.getToken()
                val request = AddHomeRequest(name, address)
                val response = homeApi.addHome(token, request)

                if (response.isSuccessful) {
                    loadHomes()
                } else {
                    val errorBody = response.errorBody()?.string()
                    val errorMessage = try {
                        Gson().fromJson(errorBody, ErrorResponse::class.java).message
                    } catch (e: JsonSyntaxException) {
                        "Unknown error: $e"
                    }
                    Timber.tag("HomeViewModel").e(errorMessage)
                }
            } catch (e: Exception) {
                Timber.tag("HomeViewModel").e("Network error: ${e.message}")
            }
        }
    }

    suspend fun deleteHome(homeId: String){
        try {
            val token = tokenRepository.getToken()
            val response = homeApi.deleteHome(token, homeId)
            if (response.isSuccessful) {
                loadHomes()
            } else {
                val errorBody = response.errorBody()?.string()
                val errorMessage = try {
                    Timber.tag("HomeViewModel").d("Home deleted successfully")
                    Gson().fromJson(errorBody, ErrorResponse::class.java).message
                } catch (e: JsonSyntaxException) {
                    "Failed to get home details: $e"
                }
                Timber.tag("TireViewModel").e(errorMessage)
                null
            }
        } catch (e: Exception) {
            Timber.tag("TireViewModel").e("Network error while getting tire: ${e.message}")
            null
        }
    }

    suspend fun archiveHome(homeId: String){
        try {
            val token = tokenRepository.getToken()
            val response = homeApi.archiveHome(token, homeId)
            if (response.isSuccessful) {
                loadHomes()
            } else {
                val errorBody = response.errorBody()?.string()
                val errorMessage = try {
                    Timber.tag("HomeViewModel").d("Home deleted successfully")
                    Gson().fromJson(errorBody, ErrorResponse::class.java).message
                } catch (e: JsonSyntaxException) {
                    "Failed to get home details: $e"
                }
                Timber.tag("TireViewModel").e(errorMessage)
                null
            }
        } catch (e: Exception) {
            Timber.tag("TireViewModel").e("Network error while getting tire: ${e.message}")
            null
        }
    }

    suspend fun unArchiveHome(homeId: String){
        try {
            val token = tokenRepository.getToken()
            val response = homeApi.unArchiveHome(token, homeId)
            if (response.isSuccessful) {
                loadHomes()
            } else {
                val errorBody = response.errorBody()?.string()
                val errorMessage = try {
                    Timber.tag("HomeViewModel").d("Home deleted successfully")
                    Gson().fromJson(errorBody, ErrorResponse::class.java).message
                } catch (e: JsonSyntaxException) {
                    "Failed to get home details: $e"
                }
                Timber.tag("TireViewModel").e(errorMessage)
                null
            }
        } catch (e: Exception) {
            Timber.tag("TireViewModel").e("Network error while getting tire: ${e.message}")
            null
        }
    }
}