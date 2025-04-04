package com.example.safehome.ui.view.auth

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.activity.enableEdgeToEdge
import androidx.fragment.app.Fragment
import com.example.safehome.databinding.ActivityAuthBinding
import com.example.safehome.ui.view.auth.fragments.LoginFragment

class AuthActivity : AppCompatActivity() {
    private lateinit var bindingActivity: ActivityAuthBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        bindingActivity = ActivityAuthBinding.inflate(layoutInflater)

        setContentView(bindingActivity.activityAuth)
        replaceFragment(LoginFragment())
    }

    fun replaceFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(bindingActivity.fragmentContainer.id, fragment)
            .addToBackStack(null) // Додає у стек (щоб працювала кнопка "Назад")
            .commit()
    }
}




