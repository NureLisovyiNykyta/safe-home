package com.example.safehome.presentation.launch

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.activity.ComponentActivity
import androidx.activity.viewModels
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.lifecycle.repeatOnLifecycle
import com.example.safehome.data.model.ErrorType
import com.example.safehome.presentation.auth.AuthActivity
import com.example.safehome.presentation.launch.viewModel.LaunchViewModel
import com.example.safehome.presentation.main.MainActivity
import kotlinx.coroutines.launch
import com.example.safehome.data.model.Result
import dagger.hilt.android.AndroidEntryPoint
import timber.log.Timber

@SuppressLint("CustomSplashScreen")
@AndroidEntryPoint
class LaunchActivity : ComponentActivity() {
    private val launchViewModel: LaunchViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        val splashScreen = installSplashScreen()
        super.onCreate(savedInstanceState)

        splashScreen.setKeepOnScreenCondition {
            launchViewModel.tokenState.value is Result.Loading
        }

        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                Timber.d("Collecting tokenState")
                launchViewModel.tokenState.collect { result ->
                    Timber.d("Token state: $result")
                    when (result) {
                        is Result.Loading -> {
                            Timber.d("Checking token...")
                        }
                        is Result.Success -> {
                            Timber.d("Token isAuthorized: ${result.data}")
                            if (result.data) {
                                startActivity(MainActivity::class.java)
                                Toast.makeText(this@LaunchActivity, "Login successful", Toast.LENGTH_SHORT).show()
                            } else {
                                startActivity(AuthActivity::class.java)
                            }
                            finish()
                        }
                        is Result.Error -> {
                            Timber.d("Token error: ${result.errorType}")
                            when (val error = result.errorType) {
                                is ErrorType.InternalError -> {
                                    Timber.d("Internal error reason: ${error.message}")
                                    startActivity(AuthActivity::class.java)
                                }
                                is ErrorType.NetworkError -> {
                                    Toast.makeText(this@LaunchActivity, error.message, Toast.LENGTH_LONG).show()
                                    startActivity(AuthActivity::class.java)
                                }
                                is ErrorType.ServerError -> {
                                    Toast.makeText(this@LaunchActivity, error.message, Toast.LENGTH_LONG).show()
                                    startActivity(AuthActivity::class.java)
                                }
                            }
                            finish()
                        }
                    }
                }
            }
        }
    }

    private fun startActivity(activityClass: Class<out ComponentActivity>) {
        val intent = Intent(this, activityClass)
        intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
        startActivity(intent)
    }
}