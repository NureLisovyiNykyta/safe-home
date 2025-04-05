package com.example.safehome.ui.auth.viewModel

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

@Suppress("unused")
class AuthViewModel : ViewModel(){
    private val _isAuthenticated = MutableStateFlow(false)
    val isAuthenticated: StateFlow<Boolean> get() = _isAuthenticated

    // Логіка автентифікації
    fun tryLogin(email: String, password: String) {
        _isAuthenticated.value = email.isNotEmpty() && password.isNotEmpty()
    }

    fun trySignUp(email: String, password: String, confirmPassword: String) {
        _isAuthenticated.value = email.isNotEmpty() && password.isNotEmpty() && password == confirmPassword
    }
}