package com.example.safehome.presentation.main.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.core.view.isVisible
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.safehome.R
import com.example.safehome.data.model.SensorDto
import com.example.safehome.databinding.FragmentSensorBinding
import com.example.safehome.presentation.main.adapter.SensorAdapter
import com.example.safehome.presentation.main.viewModel.HomesViewModel
import com.example.safehome.presentation.main.viewModel.SensorViewModel
import com.google.android.material.button.MaterialButton
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import timber.log.Timber
import kotlin.getValue

@AndroidEntryPoint
class SensorFragment : Fragment() {
    private val sensorViewModel: SensorViewModel by viewModels()
    private val homesViewModel: HomesViewModel by activityViewModels()
    private lateinit var binding: FragmentSensorBinding
    private lateinit var sensorAdapter: SensorAdapter
    private lateinit var homeId: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        homeId = arguments?.getString("home_id") ?: run {
            Timber.tag("SensorFragment").e("No home_id provided")
            findNavController().popBackStack(R.id.navigation_homes, false)
            return
        }
        sensorViewModel.setHomeId(homeId)
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentSensorBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupRecyclerView()
        observeSensorsState()
        initUI()
        setupListeners()
    }

    private fun initUI() {
        val name = arguments?.getString("home_name") ?: "Unknown Name"
        val address = arguments?.getString("home_address") ?: "Unknown Address"
        val status = arguments?.getString("home_default_mode_name") ?: "unknown"

        binding.apply {
            homeNameTextView.text = name
            homeAddressTextView.text = address
            updateStatusUI(status)
        }
    }

    private fun setupListeners() {
        binding.apply {
            setupHomeSwitch()
            backButton.setOnClickListener {
                findNavController().popBackStack(R.id.navigation_homes, false)
            }
            addSensorButton.setOnClickListener {
                showAddSensorDialog()
            }
        }
    }

    private fun setupHomeSwitch() {
        val status = arguments?.getString("home_default_mode_name") ?: "unknown"

        binding.apply {
            when (status) {
                "armed" -> {
                    homeArmedSwitch.isEnabled = true
                    homeArmedSwitch.isChecked = true
                }
                "disarmed" -> {
                    homeArmedSwitch.isEnabled = true
                    homeArmedSwitch.isChecked = false
                }
                "custom", "alert", "alarm" -> {
                    homeArmedSwitch.isEnabled = false
                    homeArmedSwitch.isChecked = true
                }
                else -> {
                    homeArmedSwitch.isVisible = false
                }
            }

            homeArmedSwitch.setOnClickListener {
                if (!homeArmedSwitch.isEnabled) {
                    homeArmedSwitch.isEnabled = true
                    Timber.tag("SensorFragment").d("SwitchCompat re-enabled")
                    homeArmedSwitch.isChecked = true
                    updateStatusUI("armed")
                    viewLifecycleOwner.lifecycleScope.launch {
                        homesViewModel.armedHome(homeId)
                    }
                }
            }

            homeArmedSwitch.setOnCheckedChangeListener { _, isChecked ->
                if (homeArmedSwitch.isEnabled) {
                    val newStatus = if (isChecked) "armed" else "disarmed"
                    Timber.tag("SensorFragment").d("SwitchCompat state changed to: $isChecked, new status: $newStatus")
                    updateStatusUI(newStatus)
                    viewLifecycleOwner.lifecycleScope.launch {
                        if (isChecked) {
                            homesViewModel.armedHome(homeId)
                        } else {
                            homesViewModel.disarmedHome(homeId)
                        }
                    }
                }
            }
        }
    }

    private fun updateStatusUI(status: String) {
        binding.apply {
            val statusImageName = when (status) {
                "armed" -> "ic_lock_close"
                "disarmed" -> "ic_lock_open"
                "custom" -> "ic_custom"
                "alert", "alarm" -> "ic_alarm"
                else -> "ic_error"
            }

            val resId = resources.getIdentifier(statusImageName, "drawable", requireContext().packageName)
            if (resId != 0) {
                statusImageView.setImageResource(resId)
            } else {
                Timber.tag("SensorFragment").e("Drawable resource not found: $statusImageName")
            }

            statusTextView.text = status.replaceFirstChar { it.uppercaseChar() }
        }
    }

    private fun observeSensorsState() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                sensorViewModel.sensorsState.collect { sensors ->
                    sensorAdapter.submitList(sensors)
                    updateHomeStatusBasedOnSensors(sensors)
                }
            }
        }
    }

    private fun setupRecyclerView() {
        sensorAdapter = SensorAdapter(
            onArchiveClick = { sensorId, isArchived ->
                viewLifecycleOwner.lifecycleScope.launch {
                    if (isArchived) sensorViewModel.unArchiveSensor(sensorId)
                    else sensorViewModel.archiveSensor(sensorId)
                }
            },
            onDeleteClick = { sensorId ->
                viewLifecycleOwner.lifecycleScope.launch {
                    sensorViewModel.deleteSensor(sensorId)
                }
            },
            onActiveChange = { sensorId, isActive ->
                viewLifecycleOwner.lifecycleScope.launch {
                    sensorViewModel.setActiveSensor(sensorId, isActive)

                    val sensors = sensorViewModel.sensorsState.value
                    updateHomeStatusBasedOnSensors(sensors)
                }
            }
        )
        binding.sensorRecyclerView.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = sensorAdapter
        }
    }

    private fun updateHomeStatusBasedOnSensors(sensors: List<SensorDto>) {
        if (sensors.isEmpty()) {
            updateStatusUI("disarmed")
            return
        }

        val allActive = sensors.all { it.is_active }
        val allInactive = sensors.all { !it.is_active }

        val newStatus = when {
            allActive -> "armed"
            allInactive -> "disarmed"
            else -> "custom"
        }

        Timber.tag("SensorFragment").d("Updating home status based on sensors: $newStatus")
        updateStatusUI(newStatus)

        binding.apply {
            when (newStatus) {
                "armed" -> {
                    homeArmedSwitch.isEnabled = true
                    homeArmedSwitch.isChecked = true
                }
                "disarmed" -> {
                    homeArmedSwitch.isEnabled = true
                    homeArmedSwitch.isChecked = false
                }
                "custom" -> {
                    homeArmedSwitch.isEnabled = false
                    homeArmedSwitch.isChecked = false
                }
            }
        }
    }

    private fun toggleUnitButton(
        clickedButton: MaterialButton,
        doorButton: MaterialButton,
        windowButton: MaterialButton,
    ): String {
        val buttons = listOf(doorButton, windowButton)

        clickedButton.isEnabled = false
        clickedButton.backgroundTintList = ContextCompat.getColorStateList(requireContext(), R.color.primary)

        buttons.filter { it != clickedButton }.forEach { button ->
            button.isEnabled = true
            button.backgroundTintList = ContextCompat.getColorStateList(requireContext(), R.color.onPrimaryVariant)
        }

        return when (clickedButton.id) {
            R.id.doorButton -> "door"
            R.id.windowButton -> "window"
            else -> "error"
        }
    }

    private fun showAddSensorDialog() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_add_sensor, null)
        val nameEditText = dialogView.findViewById<EditText>(R.id.nameEditText)
        val doorButton = dialogView.findViewById<MaterialButton>(R.id.doorButton)
        val windowButton = dialogView.findViewById<MaterialButton>(R.id.windowButton)

        var selectedUnit: String = toggleUnitButton(doorButton, doorButton, windowButton)

        doorButton.setOnClickListener {
            selectedUnit = toggleUnitButton(doorButton, doorButton, windowButton)
        }
        windowButton.setOnClickListener {
            selectedUnit = toggleUnitButton(windowButton, doorButton, windowButton)
        }

        MaterialAlertDialogBuilder(requireContext(), R.style.CustomDialogStyle)
            .setView(dialogView)
            .setPositiveButton("Save") { _, _ ->
                val name = nameEditText.text.toString()
                if (name.isBlank()){
                    Toast.makeText(requireContext(), "Name is empty", Toast.LENGTH_LONG).show()
                    return@setPositiveButton
                }
                sensorViewModel.addSensor(homeId, name, selectedUnit)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
}