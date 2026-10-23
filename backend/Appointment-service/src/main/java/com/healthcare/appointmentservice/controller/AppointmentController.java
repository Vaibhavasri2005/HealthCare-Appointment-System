
package com.healthcare.appointmentservice.controller;

import com.healthcare.appointmentservice.entity.Appointment;
import com.healthcare.appointmentservice.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService service;

    @PostMapping
    public ResponseEntity<?> createAppointment(
            @RequestBody Appointment appointment) {
        try {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(service.bookAppointment(appointment));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/slots")
    public ResponseEntity<?> getSlots(
            @RequestParam Long doctorId) {

        // Connect this endpoint to your available-slot service method.
        return ResponseEntity.ok(
                "Available slots for doctor ID: " + doctorId
        );
    }
}
