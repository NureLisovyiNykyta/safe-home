package com.example.safehome.presentation.main.viewModel

import android.content.Context
import android.widget.Toast
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.safehome.data.api.SensorApi
import com.example.safehome.data.model.ActiveSensorRequest
import com.example.safehome.data.model.AddSensorRequest
import com.example.safehome.data.model.ErrorResponse
import com.example.safehome.data.model.SensorDto
import com.example.safehome.data.repo.TokenRepository
import com.google.gson.Gson
import com.google.gson.JsonSyntaxException
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class SensorViewModel @Inject constructor(
    private val tokenRepository: TokenRepository,
    private val sensorApi: SensorApi
) : ViewModel() {
    private val _sensorsState = MutableStateFlow<List<SensorDto>>(emptyList())
    val sensorsState: StateFlow<List<SensorDto>> = _sensorsState.asStateFlow()
    private var homeId: String? = null
    private var refreshJob: Job? = null
    private var context: Context? = null

    fun setContext(context: Context) {
        this.context = context.applicationContext
    }

    fun setHomeId(homeId: String) {
        this.homeId = homeId
        startAutoRefresh()
        loadSensors()
    }

    private fun startAutoRefresh() {
        refreshJob?.cancel()
        refreshJob = viewModelScope.launch {
            while (true) {
                loadSensors()
                delay(3000)
            }
        }
    }

    fun loadSensors() {
        viewModelScope.launch {
            try {
                val token = tokenRepository.getToken()
                val response = sensorApi.getSensors(token, homeId!!)

                if (response.isSuccessful) {
                    val newSensors = response.body()?.sensors ?: emptyList()
                    if (_sensorsState.value != newSensors) {
                        _sensorsState.value = newSensors
                    }
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
                    context?.let { Toast.makeText(it, "Failed to add sensor: $errorMessage", Toast.LENGTH_SHORT).show() }
                }
            } catch (e: Exception) {
                Timber.tag("SensorViewModel").e("Network error: ${e.message}")
                context?.let { Toast.makeText(it, "Network error while adding sensor: ${e.message}", Toast.LENGTH_SHORT).show() }
            }
        }
    }

    suspend fun deleteSensor(sensorId: String) {
        try {
            val token = tokenRepository.getToken()
            val response = sensorApi.deleteSensor(token, sensorId)
            if (response.isSuccessful) {
                loadSensors()
            } else {
                val errorBody = response.errorBody()?.string()
                val errorMessage = try {
                    Gson().fromJson(errorBody, ErrorResponse::class.java).message
                } catch (e: JsonSyntaxException) {
                    "Failed to get sensor details: $e"
                }
                Timber.tag("TireViewModel").e(errorMessage)
                context?.let { Toast.makeText(it, "Failed to delete sensor: $errorMessage", Toast.LENGTH_SHORT).show() }
            }
        } catch (e: Exception) {
            Timber.tag("TireViewModel").e("Network error while getting tire: ${e.message}")
            context?.let { Toast.makeText(it, "Network error while deleting sensor: ${e.message}", Toast.LENGTH_SHORT).show() }
        }
    }

    suspend fun archiveSensor(sensorId: String) {
        try {
            val token = tokenRepository.getToken()
            val response = sensorApi.archiveSensor(token, sensorId)
            if (response.isSuccessful) {
                loadSensors()
            } else {
                val errorBody = response.errorBody()?.string()
                val errorMessage = try {
                    Gson().fromJson(errorBody, ErrorResponse::class.java).message
                } catch (e: JsonSyntaxException) {
                    "Failed to get sensor details: $e"
                }
                Timber.tag("TireViewModel").e(errorMessage)
                context?.let { Toast.makeText(it, "Failed to archive sensor: $errorMessage", Toast.LENGTH_SHORT).show() }
            }
        } catch (e: Exception) {
            Timber.tag("TireViewModel").e("Network error while getting tire: ${e.message}")
            context?.let { Toast.makeText(it, "Network error while archiving sensor: ${e.message}", Toast.LENGTH_SHORT).show() }
        }
    }

    suspend fun unArchiveSensor(sensorId: String) {
        try {
            val token = tokenRepository.getToken()
            val response = sensorApi.unArchiveSensor(token, sensorId)
            if (response.isSuccessful) {
                loadSensors()
            } else {
                val errorBody = response.errorBody()?.string()
                val errorMessage = try {
                    Gson().fromJson(errorBody, ErrorResponse::class.java).message
                } catch (e: JsonSyntaxException) {
                    "Failed to get sensor details: $e"
                }
                Timber.tag("TireViewModel").e(errorMessage)
                context?.let { Toast.makeText(it, "Failed to unarchive sensor: $errorMessage", Toast.LENGTH_SHORT).show() }
            }
        } catch (e: Exception) {
            Timber.tag("TireViewModel").e("Network error while getting tire: ${e.message}")
            context?.let { Toast.makeText(it, "Network error while unarchiving sensor: ${e.message}", Toast.LENGTH_SHORT).show() }
        }
    }

    suspend fun setActiveSensor(sensorId: String, isActive: Boolean): Boolean {
        try {
            val token = tokenRepository.getToken()
            val request = ActiveSensorRequest(isActive)
            val response = sensorApi.setActiveSensor(token, sensorId, request)

            if (response.isSuccessful) {
                val updatedSensors = _sensorsState.value.map {
                    if (it.sensor_id == sensorId) it.copy(is_active = isActive) else it
                }
                _sensorsState.value = updatedSensors
                return true
            } else {
                val errorBody = response.errorBody()?.string()
                val errorMessage = try {
                    Gson().fromJson(errorBody, ErrorResponse::class.java).message
                } catch (e: JsonSyntaxException) {
                    "Failed to get sensor details: $e"
                }
                Timber.tag("TireViewModel").e(errorMessage)
                context?.let { Toast.makeText(it, "Failed to update sensor: $errorMessage", Toast.LENGTH_SHORT).show() }
                return false
            }
        } catch (e: Exception) {
            Timber.tag("TireViewModel").e("Network error while setting active: ${e.message}")
            context?.let { Toast.makeText(it, "Network error while updating sensor: ${e.message}", Toast.LENGTH_SHORT).show() }
            return false
        }
    }

    override fun onCleared() {
        super.onCleared()
        refreshJob?.cancel()
    }
}