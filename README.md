# Healthcare Appointment System

A full-stack healthcare appointment booking application developed using **React.js, Java, Spring Boot, Microservices, and MySQL**. The system simplifies patient registration and doctor appointment scheduling by providing a digital platform for patients to browse doctors, check availability, and book appointments.

## 📌 Project Overview

The Healthcare Appointment System replaces manual patient registration and appointment scheduling with an efficient, database-connected application.

Patients can register and log in securely, enter their personal details, select a medical specialization, view available doctors, choose appointment dates and time slots, and receive booking confirmation.

The system uses a microservices architecture to ensure modularity, scalability, and efficient service communication.

## 🎯 Problem Statement

- Manual patient registration is time-consuming.
- Appointment scheduling is inefficient.
- Multiple patients may attempt to book the same appointment slot.
- Doctor availability is difficult to manage manually.

## 💡 Proposed Solution

- Digital patient registration and profile management.
- Specialization-based doctor selection.
- Dynamic doctor availability and appointment scheduling.
- Secure authentication using JWT.
- Prevention of appointment overbooking.
- Automated appointment capacity validation.
- Real-time booking confirmation through the application.

## ✨ Key Features

### Patient Management
- User registration and login.
- Secure password hashing using BCrypt.
- JWT-based authentication.
- Digital patient profile creation.
- Patient details management.
- Patient-specific appointment history.

### Doctor Management
- Browse doctors by specialization.
- View doctor name, ID, specialization, and availability.
- Dynamic doctor availability retrieval.
- Three medical specializations:
  - General Medicine
  - Ophthalmology
  - ENT (Ear, Nose, and Throat)

### Appointment Management
- Select an available doctor.
- Choose an appointment date and time slot.
- Morning and evening appointment scheduling.
- Maximum of three confirmed appointments per doctor, date, and time slot.
- Automatic slot capacity validation.
- Prevention of simultaneous overbooking.
- Appointment confirmation and status tracking.
- HTTP 409 Conflict handling for fully booked slots.

### Security and Reliability
- JWT authentication.
- BCrypt password encryption.
- Protected REST API endpoints.
- Transactional appointment booking.
- Pessimistic locking for concurrency protection.
- Centralized exception handling using `@ControllerAdvice`.
- MySQL constraints for data integrity.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript, React.js |
| Backend | Java, Spring Boot |
| Architecture | Microservices |
| Service Discovery | Netflix Eureka |
| API Gateway | Spring Cloud Gateway |
| ORM | Spring Data JPA, Hibernate |
| Security | Spring Security, JWT, BCrypt |
| Database | MySQL |
| Transaction Management | Spring `@Transactional` |
| Exception Handling | `@ControllerAdvice` |
| API Testing | Postman |
| Build Tool | Maven |
| Version Control | Git, GitHub |

## 🏗️ Microservices Architecture

The application consists of the following microservices:

| Service | Responsibility |
|---|---|
| Eureka Discovery Service | Registers and discovers microservices |
| API Gateway | Provides a single entry point and routes API requests |
| Authentication Service | Handles user registration, login, and JWT authentication |
| Patient Service | Manages patient profiles and personal details |
| Doctor Service | Manages doctor information and availability |
| Appointment Service | Handles appointment scheduling, validation, and booking |

### Service Communication

- All backend microservices register with Netflix Eureka.
- The frontend communicates with backend services through Spring Cloud Gateway.
- REST APIs are used for communication between services.
- MySQL stores user, patient, doctor, availability, and appointment information.

## 🗄️ Database Design

The application uses MySQL with the following tables:

| Table | Description |
|---|---|
| `users` | Stores user authentication details |
| `patients` | Stores patient personal information |
| `doctors` | Stores doctor information and specialization |
| `doctor_availability` | Stores doctor-specific dates and time slots |
| `appointments` | Stores confirmed appointment details |

### Appointment Scheduling

| Slot | Time | Maximum Capacity |
|---|---|---|
| Morning | 9:00 AM – 12:00 PM | 3 Patients |
| Evening | 1:00 PM – 4:00 PM | 3 Patients |

Each doctor can accept a maximum of three confirmed appointments for a particular date and time slot.

The morning and evening slots are managed independently.

## 🔄 Application Workflow

1. Patient registers or logs in using email and password.
2. The system authenticates the user and generates a JWT token.
3. The patient enters their name, age, and phone number.
4. The patient selects a medical specialization.
5. The system retrieves the doctors belonging to that specialization.
6. The patient selects an available doctor.
7. The system displays available dates and appointment slots.
8. The patient selects a date and time slot.
9. The Appointment Service validates doctor availability and slot capacity.
10. The booking is processed transactionally with concurrency protection.
11. The appointment is saved in MySQL.
12. The frontend displays the appointment confirmation and details.

## 🔐 Appointment Capacity Management

Appointment capacity is a critical business requirement.

The Appointment Service uses:

- Spring `@Transactional` for transaction management.
- Pessimistic database locking to prevent concurrent overbooking.
- Spring Data JPA for database operations.
- HTTP 409 Conflict responses when a slot is full.
- Centralized exception handling for booking conflicts.

The backend revalidates availability and capacity before confirming an appointment.

This ensures that no more than three confirmed appointments are allowed for the same doctor, date, and time slot.

## 📂 Project Structure

```text
Healthcare-Appointment-System/
│
├── api-gateway/
│
├── eureka-server/
│
├── auth-service/
│
├── patient-service/
│
├── doctor-service/
│
├── appointment-service/
│
├── healthcare-frontend/
│
├── database/
│   ├── schema.sql
│   └── data.sql
│
├── postman/
│   └── Healthcare-Appointment-System.postman_collection.json
│
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Install the following tools:

- Java Development Kit (JDK)
- Node.js and npm
- MySQL Server
- Maven
- IntelliJ IDEA
- Visual Studio Code
- Postman

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

Navigate to the project directory:

```bash
cd Healthcare-Appointment-System
```

### 2. Configure MySQL

Create the required MySQL database and configure the database credentials in the `application.yml` or `application.properties` files of the respective services.

Ensure that the database schema and initial doctor availability data are configured before starting the application.

### 3. Start the Eureka Discovery Service

Run the Eureka Discovery Service first.

Verify that the Eureka dashboard is accessible through the configured server port.

### 4. Start the Backend Microservices

Start the following services:

1. Authentication Service
2. Patient Service
3. Doctor Service
4. Appointment Service
5. API Gateway

Ensure that all microservices register successfully with Eureka.

### 5. Start the React Frontend

Navigate to the frontend directory:

```bash
cd healthcare-frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the frontend URL displayed in the terminal.

### 6. Test the Application

Use the following workflow:

- Register a new patient account.
- Log in using valid credentials.
- Enter patient details.
- Select a medical specialization.
- Browse available doctors.
- Select an available date and time slot.
- Confirm the appointment.
- Verify the appointment details in MySQL.

Use Postman to test the REST APIs and appointment capacity validation.

## 🧪 API Testing

The application REST APIs can be tested using Postman.

### Authentication

| Method | Endpoint |
|---|---|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |

### Patient Management

| Method | Endpoint |
|---|---|
| GET | `/api/patients/me` |
| POST | `/api/patients` |
| PUT | `/api/patients/me` |

### Doctor Management

| Method | Endpoint |
|---|---|
| GET | `/api/doctors?specialization={specialization}` |
| GET | `/api/doctors/{doctorId}` |
| GET | `/api/doctors/{doctorId}/availability` |

### Appointment Management

| Method | Endpoint |
|---|---|
| GET | `/api/appointments/slots?doctorId={doctorId}&date={date}` |
| POST | `/api/appointments` |
| GET | `/api/appointments/me` |
| GET | `/api/appointments/{appointmentId}` |

All API requests are routed through the Spring Cloud Gateway.

## 🚀 Future Enhancements

- Email notifications for appointment confirmation.
- Doctor administrative dashboard.
- Appointment cancellation and rescheduling.
- Medical prescription management.
- Patient medical history.
- Online payment integration.
- Hospital administrator management.

## 👩‍💻 Developed By

**Vaibhava Sri L.**

Final-Year B.E. Computer Science and Engineering Student

## 📄 License

This project is developed for educational and academic purposes.
