package com.example.safehome.presentation.main.adapter

import android.content.res.ColorStateList
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.safehome.data.model.HomeDto
import com.example.safehome.databinding.ItemHomeBinding
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import android.widget.TextView
import androidx.core.content.ContextCompat
import com.example.safehome.R
import com.google.android.material.button.MaterialButton

class HomeAdapter(
    private val onItemClick: (HomeDto) -> Unit,
    private val onArchiveClick: (String, Boolean) -> Unit,
    private val onDeleteClick: (String) -> Unit,
) : ListAdapter<HomeDto, HomeAdapter.HomeViewHolder>(HomeDiffCallback()) {

    class HomeViewHolder(
        private val binding: ItemHomeBinding,
        private val onItemClick: (HomeDto) -> Unit,
        private val onArchiveClick: (String, Boolean) -> Unit,
        private val onDeleteClick: (String) -> Unit,
    ) : RecyclerView.ViewHolder(binding.root) {
        fun bind(home: HomeDto) {
            binding.nameTextView.text = home.name
            binding.addressTextView.text = home.address
            binding.propertiesImageView.setOnClickListener {
                showPropertiesHomeDialog(home.home_id, home.name, home.is_archived)
            }
            binding.root.setOnClickListener { onItemClick(home) }

            binding.homeImageView.backgroundTintList =
                ColorStateList.valueOf(
                    if (home.is_archived)
                        ContextCompat.getColor(binding.root.context, R.color.grey)
                    else
                        ContextCompat.getColor(binding.root.context, R.color.primary)
                )
        }

        private fun showPropertiesHomeDialog(homeId: String, name: String, isArchived: Boolean) {
            val dialogView = LayoutInflater.from(binding.root.context).inflate(R.layout.dialog_home_properties, null)
            val titleTextView = dialogView.findViewById<TextView>(R.id.titleTextView)
            val archiveButton = dialogView.findViewById<MaterialButton>(R.id.archiveButton)
            val deleteButton = dialogView.findViewById<MaterialButton>(R.id.deleteButton)

            titleTextView.text = name

            archiveButton.text = if (isArchived) "UnArchived" else "Archived"

            MaterialAlertDialogBuilder(binding.root.context, R.style.CustomDialogStyle)
                .setView(dialogView)
                .setNegativeButton("Cancel", null)
                .create()
                .apply {
                    show()
                    archiveButton.setOnClickListener {
                        onArchiveClick(homeId, isArchived)
                        dismiss()
                    }
                    deleteButton.setOnClickListener {
                        onDeleteClick(homeId)
                        dismiss()
                    }
                }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): HomeViewHolder {
        val binding = ItemHomeBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return HomeViewHolder(binding, onItemClick, onArchiveClick, onDeleteClick)
    }

    override fun onBindViewHolder(holder: HomeViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    private class HomeDiffCallback : DiffUtil.ItemCallback<HomeDto>() {
        override fun areItemsTheSame(oldItem: HomeDto, newItem: HomeDto): Boolean {
            return oldItem.home_id == newItem.home_id
        }

        override fun areContentsTheSame(oldItem: HomeDto, newItem: HomeDto): Boolean {
            return oldItem == newItem
        }
    }
}