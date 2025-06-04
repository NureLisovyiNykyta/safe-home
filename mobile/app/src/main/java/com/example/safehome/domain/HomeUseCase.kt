package com.example.safehome.domain

import com.example.safehome.data.mapper.HomeMapper
import com.example.safehome.presentation.model.Home
import com.example.safehome.data.model.Result
import com.example.safehome.data.repo.HomeRepository
import javax.inject.Inject

class HomeUseCase @Inject constructor(
    private val homeRepo: HomeRepository,
    private val homeMapper: HomeMapper
) {
    /*suspend fun getHomes(): Result<List<Home>> {
        val homes = homeRepo.getHomes()
        return Result.Success(
            homes.map { homeMapper.toUi(it) }
        )
    }*/
}