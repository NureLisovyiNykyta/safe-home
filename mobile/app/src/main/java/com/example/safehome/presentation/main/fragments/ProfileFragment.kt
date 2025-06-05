package com.example.safehome.presentation.main.fragments

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.navigation.fragment.findNavController
import com.example.safehome.R
import com.example.safehome.databinding.FragmentProfileBinding
import com.example.safehome.presentation.auth.AuthActivity
import com.example.safehome.presentation.main.viewModel.ProfileViewModel
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import kotlin.getValue

@AndroidEntryPoint
class ProfileFragment : Fragment() {
    private val profileViewModel: ProfileViewModel by activityViewModels()
    private lateinit var binding: FragmentProfileBinding

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        observeHomesState()
    }

    private fun observeHomesState() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                profileViewModel.userState.collect { user ->
                    with(binding){
                        nameTextView.text = user?.user?.name
                        emailTextView.text = user?.user?.email
                        subscriptionTextView.text = user?.user?.subscription_plan_name?.replaceFirstChar { it.uppercaseChar() }

                        changePswdConstraintLayout.setOnClickListener {
                            findNavController().navigate(R.id.action_navigation_profile_to_changePasswordFragment)
                        }

                        logoutConstraintLayout.setOnClickListener {
                            showLogoutDialog()
                        }
                    }
                }
            }
        }
    }

    private fun showLogoutDialog() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_logout, null)

        MaterialAlertDialogBuilder(requireContext(), R.style.CustomDialogStyle)
            .setView(dialogView)
            .setPositiveButton("Exit") { _, _ ->
                profileViewModel.logout()

                val intent = Intent(requireContext(), AuthActivity::class.java)
                startActivity(intent)
                requireActivity().finish()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
}