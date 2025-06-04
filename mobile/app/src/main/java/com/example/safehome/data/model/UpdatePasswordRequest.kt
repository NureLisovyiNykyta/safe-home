package com.example.safehome.data.model

data class UpdatePasswordRequest(
    val new_password: String,
    val old_password: String,
)