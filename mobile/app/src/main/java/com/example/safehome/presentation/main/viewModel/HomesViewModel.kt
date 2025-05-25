package com.example.safehome.presentation.main.viewModel

import android.content.Context
import android.widget.Toast
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.safehome.presentation.model.Home
import com.example.safehome.data.model.Result
import com.example.safehome.domain.HomeUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class HomesViewModel @Inject constructor(
    @ApplicationContext private val context: Context,
    private val homeUseCase: HomeUseCase
) : ViewModel() {
    private val _homesState = MutableStateFlow<List<Home>>(emptyList())
    val homesState: StateFlow<List<Home>> = _homesState.asStateFlow()

    init {
        loadHomes()
    }

    fun loadHomes() {
        viewModelScope.launch {
            when (val result = homeUseCase.getHomes()) {
                is Result.Success -> {
                    Timber.tag("Homes").d("Homes loaded: ${result.data.size}")
                    _homesState.value = result.data
                }
                is Result.Loading -> {
                    Timber.tag("Homes").d("Loading homes...")
                }
                is Result.Error -> {
                    val message = result.errorType.message
                    Timber.tag("Homes").e("Error loading homes: $message")
                    Toast.makeText(context, message, Toast.LENGTH_LONG).show()
                    _homesState.value = emptyList()
                }
            }
        }
    }
}