package com.example.safehome.data.model

data class DateModel(
    val month: Int = 0,
    val day: Int = 1,
    val year: Int = 2023
) {
    companion object {
        val months = arrayOf(
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        )
    }

    fun toFormattedString(): String = "${months[month]} $day $year"
}