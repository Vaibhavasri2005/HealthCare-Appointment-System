package com.healthcare.patientservice;


import com.healthcare.patientservice.Patient;
import com.healthcare.patientservice.PatientService;
import com.healthcare.patientservice.PatientService.PatientNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:5173/")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<Patient> getPatientById(
            @PathVariable Long patientId) {
        return patientService.getPatientById(patientId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Patient> getPatientByUserId(
            @PathVariable Long userId) {
        return patientService.getPatientByUserId(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Patient> createOrUpdatePatient(
            @RequestBody Patient patient) {
        Patient saved = patientService.savePatient(patient);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{patientId}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable Long patientId,
            @RequestBody Patient patient) {
        try {
            return ResponseEntity.ok(
                    patientService.updatePatient(patientId, patient));
        } catch (PatientNotFoundException exception) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{patientId}")
    public ResponseEntity<Void> deletePatient(
            @PathVariable Long patientId) {
        try {
            patientService.deletePatient(patientId);
            return ResponseEntity.noContent().build();
        } catch (PatientNotFoundException exception) {
            return ResponseEntity.notFound().build();
        }
    }
}
