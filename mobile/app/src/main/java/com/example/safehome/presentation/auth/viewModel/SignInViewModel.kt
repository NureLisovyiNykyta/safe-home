package com.example.safehome.presentation.auth.viewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.safehome.data.model.ErrorType
import com.example.safehome.data.model.Result
import com.example.safehome.domain.AuthUseCase
import com.example.safehome.presentation.auth.utils.ValidatorUtils
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SignInViewModel @Inject constructor(
    private val authUseCase: AuthUseCase
) : ViewModel() {
    private val _authState = MutableStateFlow<Result<Boolean>>(Result.Loading)
    val authState: StateFlow<Result<Boolean>> get() = _authState

    fun checkUserAuthorization(email: String, password: String) {
        when {
            !ValidatorUtils.isNotBlank(email, password) -> {
                _authState.value = Result.Error(
                    ErrorType.InternalError("Email or password is empty")
                )
            }
            else -> {
                _authState.value = Result.Loading
                viewModelScope.launch {
                    val result = authUseCase.isUserAuthorized(email, password)
                    _authState.value = result
                }
            }
        }
    }
}
