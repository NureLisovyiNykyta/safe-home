package com.example.safehome.presentation.auth.viewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import com.example.safehome.data.model.Result
import com.example.safehome.domain.AuthUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authUseCase: AuthUseCase
) : ViewModel() {

    private val _authState = MutableStateFlow<Result<Boolean>>(Result.Loading)
    val authState: StateFlow<Result<Boolean>> get() = _authState

    fun checkUserAuthorization(email: String, password: String) {
        if (email.isEmpty() || password.isEmpty()) {
            _authState.value = Result.Error(message = "Email or password is empty")
            return
        }

        _authState.value = Result.Loading
        viewModelScope.launch {
            val result = authUseCase.isUserAuthorized(email, password)
            _authState.value = result
        }
    }
}