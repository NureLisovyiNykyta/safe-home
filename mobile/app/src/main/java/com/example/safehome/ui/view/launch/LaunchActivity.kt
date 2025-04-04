package com.example.safehome.ui.view.launch

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import com.example.safehome.ui.view.auth.AuthActivity
import com.example.safehome.ui.view.main.MainActivity

@SuppressLint("CustomSplashScreen")
class LaunchActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)

        val intent = if (isUserAuthenticated()) {
            Intent(this, MainActivity::class.java)
        } else {
            Intent(this, AuthActivity::class.java)
        }

        startActivity(intent)
        finish() // Закриваємо LaunchActivity
    }

    private fun isUserAuthenticated(): Boolean {
        // Перевірка авторизації (замініть на свій метод)
        return false
    }
}
