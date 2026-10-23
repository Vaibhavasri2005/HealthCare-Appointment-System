package com.healthcare.patientservice;


import com.healthcare.patientservice.Patient;
import com.healthcare.patientservice.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long patientId) {
        return patientRepository.findById(patientId);
    }

    public Optional<Patient> getPatientByUserId(Long userId) {
        return patientRepository.findByUserId(userId);
    }



    @Transactional
    public Patient savePatient(Patient patient) {

        // Allow patient records without a registered account.
        if (patient.getUserId() == null) {
            return patientRepository.save(patient);
        }

        // If the account already has a patient record, update it.
        return patientRepository.findByUserId(patient.getUserId())
                .map(existing -> {
                    existing.setName(patient.getName());
                    existing.setAge(patient.getAge());
                    existing.setPhone(patient.getPhone());
                    existing.setEmail(patient.getEmail());
                    return patientRepository.save(existing);
                })
                .orElseGet(() -> patientRepository.save(patient));
    }


    @Transactional
    public Patient updatePatient(Long patientId, Patient updatedPatient) {
        Patient existing = patientRepository.findById(patientId)
                .orElseThrow(() -> new PatientNotFoundException(
                        "Patient not found with ID: " + patientId));

        existing.setName(updatedPatient.getName());
        existing.setAge(updatedPatient.getAge());
        existing.setPhone(updatedPatient.getPhone());
        existing.setEmail(updatedPatient.getEmail());

        return patientRepository.save(existing);
    }

    public void deletePatient(Long patientId) {
        if (!patientRepository.existsById(patientId)) {
            throw new PatientNotFoundException("Patient not found with ID: " + patientId);
        }
        patientRepository.deleteById(patientId);
    }

    public static class PatientNotFoundException
            extends RuntimeException {

        public PatientNotFoundException(String message) {
            super(message);
        }
    }
}