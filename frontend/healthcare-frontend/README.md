# HEALTHCARE APPOINTMENT SYSTEM

## 1. About the Project

The Healthcare Appointment System is a web-based application that allows patients to register, view doctors by specialization, check doctor availability, and book appointments online.

The system uses React.js for the frontend, Java Spring Boot microservices for the backend, and MySQL for data storage.

## 2. Problem Statements

### Problem 1: Manual Patient Registration
Hospitals often use paper forms to register patients. This takes time and may cause incorrect information and duplicate records.

### Problem 2: Inefficient Appointment Scheduling
Manual appointment scheduling can cause long waiting times, double bookings, and confusion about doctor availability.

## 3. Solutions

### 1. Digital Patient Registration
- Patients can register using their email ID and password.
- Patient details are stored in MySQL.
- Digital records reduce manual work and data entry errors.

### 2. Smart Appointment Scheduling
- Patients can view doctors based on their specialization.
- The system displays doctor availability and available appointment slots.
- Each doctor can accept a maximum of three patients per slot.
- The backend validates bookings to prevent overbooking and scheduling conflicts.

**Expected Result:** Faster registration, better scheduling, fewer booking conflicts, and improved appointment management.

## 4. Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- React.js

### Backend
- Java
- Spring Boot Microservices
- Netflix Eureka Service Discovery
- Spring Cloud Gateway
- Spring Web
- Spring Data JPA
- Hibernate
- JWT Authentication
- BCrypt Password Hashing
- Spring `@Transactional`
- HTTP 409 Conflict
- Spring Exception Handling using `@ControllerAdvice`

### Database
- MySQL
- MySQL UNIQUE Constraints

### Testing Tools
- Postman

## 5. Project Architecture

The application follows a microservices architecture.

- **Frontend:** Provides patient registration, doctor selection, and appointment booking pages.
- **Auth Service:** Handles user registration and authentication.
- **Doctor Service:** Retrieves doctors by specialization and provides doctor information.
- **Patient Service:** Stores and manages patient details.
- **Appointment Service:** Validates and manages appointment bookings.
- **API Gateway:** Routes requests to the appropriate backend services.
- **Eureka Server:** Enables service registration and discovery.
- **MySQL:** Stores user, patient, doctor, availability, and appointment records.

## 6. Project Folder Structure

```text
Healthcare-Appointment-System/
├── README.md
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── backend/
    ├── doctor-service/
    ├── patient-service/
    ├── appointment-service/
    ├── auth-service/
    ├── api-gateway/
    └── eureka-server/
```

## 7. Database Design

### Users Table

Stores user account and authentication information.

| Field | Description |
|---|---|
| user_id | Unique user ID |
| username | User email or username |
| password_hash | BCrypt-hashed password |
| role | User role, such as PATIENT |

### Patients Table

Stores patient details.

| Field | Description |
|---|---|
| patient_id | Unique patient ID |
| name | Patient name |
| age | Patient age |
| email | Patient email |
| phone | Patient phone number |

### Doctors Table

Stores doctor information.

| Field | Description |
|---|---|
| doctor_id | Unique doctor ID |
| name | Doctor name |
| specialization | General Medicine, Ophthalmology, or ENT |

The database contains two doctors for each specialization, making six doctors in total.

### Doctor Availability Table

Stores the dates and time ranges when doctors are available.

| Field | Description |
|---|---|
| availability_id | Unique availability ID |
| doctor_id | Associated doctor ID |
| date | Available appointment date |
| start_time | Availability start time |
| end_time | Availability end time |

### Appointments Table

Stores appointment booking details.

| Field | Description |
|---|---|
| appointment_id | Unique appointment ID |
| patient_id | Associated patient ID |
| doctor_id | Selected doctor ID |
| appointment_time | Appointment date and time |
| status | Appointment status |

## 8. Application Workflow

### Step 1: User Registration

- The patient opens the application homepage.
- The patient enters an email ID and password.
- The Auth Service processes the registration request.
- The account information is stored in MySQL.

### Step 2: Homepage

After registration, the patient proceeds to the homepage and clicks the **Make Appointment** button.

### Step 3: Enter Patient Details

The patient fills in the following information:

- Name
- Age
- Phone number
- Doctor specialization

The available specializations are:

1. General Medicine
2. Ophthalmology
3. ENT

### Step 4: Select a Doctor

The backend retrieves doctors belonging to the selected specialization.

Each doctor card displays:

- Doctor name
- Doctor ID
- Specialization
- Availability status: Available or Not Available

The patient can select an available doctor. Doctors marked as Not Available cannot be booked.

### Step 5: Select Date and Time Slot

The system displays the selected doctor's available dates and appointment slots.


Each doctor can accept a maximum of three appointments in the morning slot and three appointments in the evening slot on a particular date.

For example, if three patients have booked the morning slot on 12 October 2026, that doctor's morning slot is closed for additional bookings on that date. The evening slot remains available if it has capacity.

### Step 6: Validate and Save the Appointment

1. The patient selects a doctor, date, and time slot.
2. The frontend sends the booking request to the backend.
3. Spring Boot checks the doctor's availability and the number of existing appointments for the selected date and slot.
4. The backend validates the booking again before saving it.
5. The appointment is saved in MySQL if the slot has capacity.
6. If the slot is full or a booking conflict occurs, the backend rejects the request and returns an appropriate error, such as HTTP 409 Conflict.

### Step 7: Appointment Confirmation

After a successful booking, the frontend displays a confirmation message containing the appointment details, such as the doctor name, appointment date, time slot, and appointment status.

## 9. Appointment Booking Rules

- A patient must enter their details before booking an appointment.
- A patient can select only one doctor for each booking.
- Only available doctors can be booked.
- Each doctor has separate morning and evening appointment capacities for each date.
- Each slot has a maximum capacity of three patients.
- The backend must recheck availability when saving a booking to prevent concurrent requests from exceeding the limit.
- MySQL constraints and transaction-based validation help maintain data consistency.
- Duplicate or conflicting bookings should be rejected according to the application's booking rules.

## 10. API Endpoints

The following are example endpoint paths. Confirm the exact paths and HTTP methods in the implemented controllers and API Gateway configuration.

| Service | Example Endpoint | Purpose |
|---|---|---|
| Auth Service | `POST /api/auth/register` | Register a user |
| Auth Service | `POST /api/auth/login` | Authenticate a user, if implemented |
| Doctor Service | `GET /api/doctor` | Retrieve doctors |
| Patient Service | `/api/patients` | Create or retrieve patient records |
| Appointment Service | `/api/appointments` | Create or retrieve appointments |

The frontend communicates with the backend through the API Gateway when the relevant routes are configured.

## 11. Running the Project

### Prerequisites

- Java JDK compatible with the Spring Boot services
- Node.js and npm
- MySQL Server
- IntelliJ IDEA
- Postman (optional)

### Start the Backend

1. Start MySQL.
2. Run the Eureka Server.
3. Run the Doctor Service.
4. Run the Patient Service.
5. Run the Auth Service.
6. Run the Appointment Service.
7. Run the API Gateway.

Ensure that the service ports, database settings, and Eureka configuration match each application's configuration files.

### Start the Frontend

Open a terminal inside the frontend directory and execute:

```bash
npm install
npm run dev
```

Open the local URL displayed in the terminal.

## 12. Testing

Use Postman to test the backend REST APIs.

Test cases include:

- User registration
- Retrieving doctors by specialization
- Saving patient details
- Booking an available appointment
- Rejecting bookings when a slot is full
- Preventing simultaneous bookings from exceeding the three-patient limit
- Displaying appropriate errors for invalid or unavailable slots
- Confirming successful appointments

## 13. Future Enhancements

- JWT-based login and protected API routes
- Appointment cancellation and rescheduling
- Patient appointment history
- Doctor-side appointment management
- Improved validation and automated testing

## 14. Conclusion

The Healthcare Appointment System simplifies patient registration and doctor appointment scheduling. It provides a structured way to manage patient records, view doctor availability, and book appointments while limiting each doctor to three patients per time slot.