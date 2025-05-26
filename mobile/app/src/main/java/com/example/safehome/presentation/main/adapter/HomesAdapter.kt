package com.example.safehome.presentation.main.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.safehome.databinding.ItemHomeBinding
import com.example.safehome.presentation.model.Home

class HomesAdapter(
    private val onItemClick: (Home) -> Unit
) : ListAdapter<Home, HomesAdapter.HomeViewHolder>(HomeDiffCallback()) {

    class HomeViewHolder(
        private val binding: ItemHomeBinding,
        private val onItemClick: (Home) -> Unit
    ) : RecyclerView.ViewHolder(binding.root) {
        fun bind(home: Home) {
            binding.nameTextView.text = home.name
            binding.addressTextView.text = home.address ?: ""
            binding.root.setOnClickListener { onItemClick(home) }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): HomeViewHolder {
        val binding = ItemHomeBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return HomeViewHolder(binding, onItemClick)
    }

    override fun onBindViewHolder(holder: HomeViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    private class HomeDiffCallback : DiffUtil.ItemCallback<Home>() {
        override fun areItemsTheSame(oldItem: Home, newItem: Home): Boolean {
            return oldItem.homeId == newItem.homeId
        }

        override fun areContentsTheSame(oldItem: Home, newItem: Home): Boolean {
            return oldItem == newItem
        }
    }
}