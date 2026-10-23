package com.healthcare.appointmentservice.service;


import com.healthcare.appointmentservice.entity.Appointment;
import com.healthcare.appointmentservice.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository repository;

    @Transactional
    public Appointment bookAppointment(Appointment appointment) {
        long count = repository.countByAvailabilityId(appointment.getAvailabilityId());
        if (count >= 3) {
            throw new RuntimeException("Slot is full");
        }
        return repository.save(appointment);
    }
}
