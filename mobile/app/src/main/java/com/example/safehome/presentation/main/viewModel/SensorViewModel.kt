package com.example.safehome.presentation.main.viewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.safehome.com.example.safehome.data.model.ActiveSensorRequest
import com.example.safehome.data.api.SensorApi
import com.example.safehome.data.model.AddSensorRequest
import com.example.safehome.data.model.ErrorResponse
import com.example.safehome.data.model.SensorDto
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
class SensorViewModel @Inject constructor(
    private var tokenRepository: TokenRepository,
    private val sensorApi: SensorApi
) : ViewModel() {
    private val _sensorsState = MutableStateFlow<List<SensorDto>>(emptyList())
    val sensorsState: StateFlow<List<SensorDto>> = _sensorsState.asStateFlow()
    private var homeId: String? = null

    fun setHomeId(homeId: String) {
        this.homeId = homeId
        loadSensors()
    }

    fun loadSensors() {
        viewModelScope.launch {
            try {
                val token = tokenRepository.getToken()
                val response = sensorApi.getSensors(token, homeId!!)

                if (response.isSuccessful) {
                    _sensorsState.value = response.body()?.sensors!!
                } else {
                    val errorBody = response.errorBody()?.string()
                    val errorMessage = try {
                        Gson().fromJson(errorBody, ErrorResponse::class.java).message
                    } catch (e: JsonSyntaxException) {
                        "Unknown error: $e"
                    }
                    _sensorsState.value = emptyList()
                    Timber.tag("SensorViewModel").e(errorMessage)
                }
            } catch (e: Exception) {
                Timber.tag("SensorViewModel").e("Network error: ${e.message}")
            }
        }
    }

    fun updateSensorsState(updatedSensors: List<SensorDto>) {
        _sensorsState.value = updatedSensors
    }

    fun addSensor(homeId: String, name: String, type: String) {
        viewModelScope.launch {
            try {
                val token = tokenRepository.getToken()
                val request = AddSensorRequest(homeId, name, type)
                val response = sensorApi.addSensor(token, request)

                if (response.isSuccessful) {
                    loadSensors()
                } else {
                    val errorBody = response.errorBody()?.string()
                    val errorMessage = try {
                        Gson().fromJson(errorBody, ErrorResponse::class.java).message
                    } catch (e: JsonSyntaxException) {
                        "Unknown error: $e"
                    }
                    Timber.tag("SensorViewModel").e(errorMessage)
                }
            } catch (e: Exception) {
                Timber.tag("SensorViewModel").e("Network error: ${e.message}")
            }
        }
    }

    suspend fun deleteSensor(sensorId: String){
        try {
            val token = tokenRepository.getToken()
            val response = sensorApi.deleteSensor(token, sensorId)
            if (response.isSuccessful) {
                loadSensors()
            } else {
                val errorBody = response.errorBody()?.string()
                val errorMessage = try {
                    Timber.tag("SensorViewModel").d("Sensor deleted successfully")
                    Gson().fromJson(errorBody, ErrorResponse::class.java).message
                } catch (e: JsonSyntaxException) {
                    "Failed to get sensor details: $e"
                }
                Timber.tag("TireViewModel").e(errorMessage)
                null
            }
        } catch (e: Exception) {
            Timber.tag("TireViewModel").e("Network error while getting tire: ${e.message}")
            null
        }
    }

    suspend fun archiveSensor(sensorId: String){
        try {
            val token = tokenRepository.getToken()
            val response = sensorApi.archiveSensor(token, sensorId)
            if (response.isSuccessful) {
                loadSensors()
            } else {
                val errorBody = response.errorBody()?.string()
                val errorMessage = try {
                    Timber.tag("SensorViewModel").d("Sensor deleted successfully")
                    Gson().fromJson(errorBody, ErrorResponse::class.java).message
                } catch (e: JsonSyntaxException) {
                    "Failed to get sensor details: $e"
                }
                Timber.tag("TireViewModel").e(errorMessage)
                null
            }
        } catch (e: Exception) {
            Timber.tag("TireViewModel").e("Network error while getting tire: ${e.message}")
            null
        }
    }

    suspend fun unArchiveSensor(sensorId: String){
        try {
            val token = tokenRepository.getToken()
            val response = sensorApi.unArchiveSensor(token, sensorId)
            if (response.isSuccessful) {
                loadSensors()
            } else {
                val errorBody = response.errorBody()?.string()
                val errorMessage = try {
                    Timber.tag("SensorViewModel").d("Sensor deleted successfully")
                    Gson().fromJson(errorBody, ErrorResponse::class.java).message
                } catch (e: JsonSyntaxException) {
                    "Failed to get sensor details: $e"
                }
                Timber.tag("TireViewModel").e(errorMessage)
                null
            }
        } catch (e: Exception) {
            Timber.tag("TireViewModel").e("Network error while getting tire: ${e.message}")
            null
        }
    }

    suspend fun setActiveSensor(sensorId: String, isActive: Boolean){
        try {
            val token = tokenRepository.getToken()
            val request = ActiveSensorRequest(isActive)
            val response = sensorApi.setActiveSensor(token, sensorId, request)

            if (response.isSuccessful) {
                val updatedSensors = _sensorsState.value.map {
                    if (it.sensor_id == sensorId) it.copy(is_active = isActive) else it
                }
                _sensorsState.value = updatedSensors
            } else {
                val errorBody = response.errorBody()?.string()
                val errorMessage = try {
                    Timber.tag("SensorViewModel").d("Sensor deleted successfully")
                    Gson().fromJson(errorBody, ErrorResponse::class.java).message
                } catch (e: JsonSyntaxException) {
                    "Failed to get sensor details: $e"
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