package com.example.safehome.data.repo

import com.example.safehome.data.api.HomeApi
import com.example.safehome.data.local.dao.HomeDao
import com.example.safehome.data.mapper.HomeMapper
import com.example.safehome.data.model.HomeDto
import com.example.safehome.data.model.Result
import com.example.safehome.data.network.NetworkHandler
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class HomeRepository @Inject constructor(
    private val homeApi: HomeApi,
    private val networkHandler: NetworkHandler,
    private val tokenRepository: TokenRepository,
    private val homeDao: HomeDao,
    private val homeMapper: HomeMapper,
) {
    suspend fun getHomes(): List<HomeDto> {
        val cachedHomes = homeDao.getAllHomes()
        return if (cachedHomes.isNotEmpty()) {
            cachedHomes.map { homeMapper.entityToDto(it) }
        } else {
            when (val result = fetchAndCacheHomes()) {
                is Result.Success -> result.data
                else -> emptyList()
            }
        }
    }

    /*suspend fun addHome(): Result<Response> {
        return networkHandler.safeApiCall {
            homeApi.addHome(Request())
        }
    }

    suspend fun deleteHome(): Result<Response> {
        return networkHandler.safeApiCall {
            homeApi.deleteHome(Request())
        }
    }

    suspend fun archiveHome(): Result<Response> {
        return networkHandler.safeApiCall {
            homeApi.archiveHome(Request())
        }
    }

    suspend fun unarchiveHome(): Result<Response> {
        return networkHandler.safeApiCall {
            homeApi.unArchiveHome(Request())
        }
    }

    suspend fun setSecurityArmed(): Result<Response> {
        return networkHandler.safeApiCall {
            homeApi.armedHome(Request())
        }
    }

    suspend fun setSecurityDisarmed(): Result<Response> {
        return networkHandler.safeApiCall {
            homeApi.disarmedHome(Request())
        }
    }*/

    private suspend fun fetchAndCacheHomes(): Result<List<HomeDto>> {
        val result = networkHandler.safeApiCall {
            val token = tokenRepository.getToken() ?: throw IllegalStateException("Token is null")
            homeApi.getHomes("Bearer $token")
        }
        return when (result) {
            is Result.Success -> {
                val homes = result.data.homes
                homeDao.clearHomes()
                homeDao.insertHomes(homes.map { homeMapper.dtoToEntity(it) })
                Result.Success(homes)
            }
            is Result.Error -> result
            is Result.Loading -> Result.Loading
        }
    }
}