package com.example.safehome.data.repo

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.first
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "auth_prefs")

@Singleton
class TokenRepository @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val tokenKey = stringPreferencesKey("token")

    suspend fun saveToken(token: String) {
        context.dataStore.edit { prefs ->
            prefs[tokenKey] = token
        }
    }

    suspend fun getToken(): String? {
        return context.dataStore.data.first()[tokenKey]
    }

    suspend fun clearToken() {
        context.dataStore.edit { prefs ->
            prefs.remove(tokenKey)
        }
    }
}