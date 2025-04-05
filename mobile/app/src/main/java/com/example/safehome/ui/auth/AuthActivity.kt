package com.example.safehome.ui.auth

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.activity.enableEdgeToEdge
import com.example.safehome.databinding.ActivityAuthBinding

class AuthActivity : AppCompatActivity() {
    private lateinit var bindingActivity: ActivityAuthBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        bindingActivity = ActivityAuthBinding.inflate(layoutInflater)
        setContentView(bindingActivity.activityAuth)
    }
}




