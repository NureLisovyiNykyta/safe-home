package com.example.safehome.data.model

data class HomesResponse(
    val homes: List<HomeDto>
)

data class HomeDto(
    val address: String,
    val created_at: String,
    val default_mode_id: String,
    val default_mode_name: String,
    val home_id: String,
    val is_archived: Boolean,
    val name: String
)