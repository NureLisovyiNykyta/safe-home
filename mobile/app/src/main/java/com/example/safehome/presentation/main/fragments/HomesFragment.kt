package com.example.safehome.presentation.main.fragments

import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.example.safehome.R
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.Toast
import androidx.fragment.app.viewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import com.example.safehome.databinding.FragmentHomesBinding
import com.example.safehome.presentation.main.adapter.HomesAdapter
import com.example.safehome.presentation.main.viewModel.HomesViewModel
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch

@AndroidEntryPoint
class HomesFragment : Fragment() {
    private val viewModel: HomesViewModel by viewModels()
    private lateinit var binding: FragmentHomesBinding
    private lateinit var homesAdapter: HomesAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = FragmentHomesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupRecyclerView()
        observeHomesState()

        binding.addButton.setOnClickListener {
            showAddHomeDialog()
        }
    }

    private fun observeHomesState() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.homesState.collect { homes ->
                    if (homes.isNotEmpty()) {
                        homesAdapter.submitList(homes)
                    }
                }
            }
        }
    }

    private fun setupRecyclerView() {
        homesAdapter = HomesAdapter { home ->
            Toast.makeText(context, "Clicked home: ${home.name}", Toast.LENGTH_LONG).show()
        }
        binding.homesRecyclerView.adapter = homesAdapter
    }

    private fun showAddHomeDialog() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_add_home, null)
        val nameEditText = dialogView.findViewById<EditText>(R.id.nameEditText)
        val addressEditText = dialogView.findViewById<EditText>(R.id.addressEditText)

        MaterialAlertDialogBuilder(requireContext(), R.style.CustomDialogStyle)
            .setView(dialogView)
            .setPositiveButton("Save") { _, _ ->
                val name = nameEditText.text.toString()
                if (name.isBlank()){
                    Toast.makeText(requireContext(), "Name is empty", Toast.LENGTH_LONG).show()
                    return@setPositiveButton
                }
                //viewModel.addHome(name, address)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
}