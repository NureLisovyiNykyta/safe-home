package com.example.safehome.presentation.main.viewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.safehome.data.model.Result
import com.example.safehome.domain.SubscriptionsUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.channels.BufferOverflow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SubscriptionsViewModel @Inject constructor(
    private val subscriptionsUseCase: SubscriptionsUseCase
) : ViewModel() {
    private val _state = MutableSharedFlow<Result<Boolean>>(
        replay = 0,
        extraBufferCapacity = 1,
        onBufferOverflow = BufferOverflow.DROP_OLDEST
    )
    val state: SharedFlow<Result<Boolean>> get() = _state.asSharedFlow()

    fun fnk(email: String) {
        _state.tryEmit(Result.Loading)
        viewModelScope.launch {
            //val result = homesUseCase.
            //_state.emit(result)
        }
    }
}