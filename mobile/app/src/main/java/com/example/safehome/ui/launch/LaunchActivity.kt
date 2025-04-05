package com.example.safehome.ui.launch

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import com.example.safehome.ui.auth.AuthActivity
import com.example.safehome.ui.main.MainActivity

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
        finish()
    }

    private fun isUserAuthenticated(): Boolean {
        // Перевірка авторизації
        return false
    }
}
