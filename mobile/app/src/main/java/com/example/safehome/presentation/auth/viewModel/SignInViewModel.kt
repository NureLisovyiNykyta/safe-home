package com.example.safehome.presentation.auth.viewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.safehome.data.model.ErrorType
import com.example.safehome.data.model.Result
import com.example.safehome.domain.AuthUseCase
import com.example.safehome.presentation.auth.utils.ValidatorUtils
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.channels.BufferOverflow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SignInViewModel @Inject constructor(
    private val authUseCase: AuthUseCase
) : ViewModel() {
    private val _authState = MutableSharedFlow<Result<Boolean>>(
        replay = 0,
        extraBufferCapacity = 1,
        onBufferOverflow = BufferOverflow.DROP_OLDEST
    )
    val authState: SharedFlow<Result<Boolean>> get() = _authState.asSharedFlow()

    fun checkUserAuthorization(email: String, password: String) {
        when {
            !ValidatorUtils.isNotBlank(email, password) -> {
                _authState.tryEmit(
                    Result.Error(ErrorType.InternalError("Email or password is empty"))
                )
            }

            !ValidatorUtils.isValidEmail(email) -> {
                _authState.tryEmit(
                    Result.Error(ErrorType.InternalError("Email is incorrect"))
                )
            }

            !ValidatorUtils.isValidPassword(password) -> {
                _authState.tryEmit(
                    Result.Error(ErrorType.InternalError("Password must be 8 characters or more"))
                )
            }

            else -> {
                _authState.tryEmit(Result.Loading)
                viewModelScope.launch {
                    val result = authUseCase.isUserAuthorized(email, password)
                    _authState.emit(result)
                }
            }
        }
    }
}
