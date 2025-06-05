package com.example.safehome.presentation.main.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.TextView
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
    private var initialStatus: String? = null

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
        initialStatus = arguments?.getString("home_default_mode_name") ?: "unknown"

        binding.apply {
            homeNameTextView.text = name
            homeAddressTextView.text = address
        }
    }

    private fun setupListeners() {
        binding.apply {
            backButton.setOnClickListener {
                findNavController().popBackStack(R.id.navigation_homes, false)
            }
            addSensorButton.setOnClickListener {
                showAddSensorDialog()
            }
        }
    }

    private fun setupHomeSwitch(status: String) {
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
                    updateAllSensorsActiveState(true)
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
                    updateAllSensorsActiveState(isChecked)
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
                    val effectiveStatus = determineEffectiveStatus(sensors)
                    updateStatusUI(effectiveStatus)
                    setupHomeSwitch(effectiveStatus)
                }
            }
        }
    }

    private fun determineEffectiveStatus(sensors: List<SensorDto>): String {
        // Якщо список сенсорів порожній, повертаємо початковий статус
        if (sensors.isEmpty()) {
            return initialStatus?.takeIf { it != "unknown" } ?: "disarmed"
        }

        val allActive = sensors.all { it.is_active }
        val allInactive = sensors.all { !it.is_active }

        return when {
            allActive -> "armed"
            allInactive -> "disarmed"
            else -> "custom"
        }
    }

    private fun updateAllSensorsActiveState(isActive: Boolean) {
        val currentSensors = sensorViewModel.sensorsState.value
        if (currentSensors.isEmpty()) return

        val updatedSensors = currentSensors.map { sensor ->
            sensor.copy(is_active = isActive)
        }
        sensorViewModel.updateSensorsState(updatedSensors) // Оновлюємо локальний стан у ViewModel
        sensorAdapter.submitList(updatedSensors) // Оновлюємо UI у RecyclerView
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
                    val newStatus = determineEffectiveStatus(sensors)
                    updateStatusUI(newStatus)
                    setupHomeSwitch(newStatus)
                }
            }
        )
        binding.sensorRecyclerView.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = sensorAdapter
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
        val cancelButton = dialogView.findViewById<TextView>(R.id.cancelButton)
        val addButton = dialogView.findViewById<TextView>(R.id.saveButton)

        var selectedUnit: String = toggleUnitButton(doorButton, doorButton, windowButton)

        doorButton.setOnClickListener {
            selectedUnit = toggleUnitButton(doorButton, doorButton, windowButton)
        }
        windowButton.setOnClickListener {
            selectedUnit = toggleUnitButton(windowButton, doorButton, windowButton)
        }

        MaterialAlertDialogBuilder(requireContext(), R.style.CustomDialogStyle)
            .setView(dialogView)
            .create()
            .apply {
                show()
                cancelButton.setOnClickListener {
                    dismiss()
                }
                addButton.setOnClickListener {
                    val name = nameEditText.text.toString()
                    sensorViewModel.addSensor(homeId, name, selectedUnit)
                    dismiss()
                }
            }
    }
}