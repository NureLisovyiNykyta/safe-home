package com.example.safehome.presentation.main.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.safehome.R
import com.example.safehome.databinding.FragmentSensorBinding
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class SensorFragment : Fragment() {
    private lateinit var binding: FragmentSensorBinding

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentSensorBinding.inflate(inflater, container, false)
        return binding.root

        binding.backButton.setOnClickListener {
            findNavController().popBackStack(R.id.homesFragment, false)
        }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)


    }
}