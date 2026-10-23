
import { useEffect, useState } from "react";
import {
  bookAppointment,
  getDoctors,
  register,
  savePatient,
} from "./api";
import "./App.css";

function getList(data) {
  if (Array.isArray(data)) return data;

  return data?.content ?? data?.doctors ?? [];
}

function getMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    (typeof error?.response?.data === "string"
      ? error.response.data
      : "") ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function doctorId(doctor) {
  return doctor?.doctorId ?? doctor?.id;
}

function doctorName(doctor) {
  return doctor?.name ?? doctor?.doctorName ?? "Doctor";
}

// Returns the current local date/time in a format suitable for datetime-local.
function getLocalDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

function formatAppointmentTime(value) {
  if (!value) return "Not provided";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString();
}

export default function App() {
  const [step, setStep] = useState("register");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [patient, setPatient] = useState({
    name: "",
    age: "",
    phone: "",
    email: "",
  });

  const [patientId, setPatientId] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointment, setAppointment] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (step !== "doctors") return undefined;

    let cancelled = false;

    async function loadDoctors() {
      setLoading(true);
      setError("");

      try {
        const response = await getDoctors();

        if (!cancelled) {
          setDoctors(getList(response));
        }
      } catch (requestError) {
        if (!cancelled) {
          setDoctors([]);
          setError(`Could not load doctors: ${getMessage(requestError)}`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDoctors();

    return () => {
      cancelled = true;
    };
  }, [step]);

  async function handleRegister(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim() || !password) {
      setError("Enter your email address and password.");
      return;
    }

    setLoading(true);

    try {
      await register(email.trim(), password);

      setPatient((current) => ({
        ...current,
        email: email.trim(),
      }));

      setMessage("Account created. Choose a doctor to continue.");
      setStep("doctors");
    } catch (requestError) {
      setError(`Registration failed: ${getMessage(requestError)}`);
    } finally {
      setLoading(false);
    }
  }

  function selectDoctor(doctor) {
    setSelectedDoctor(doctor);
    setAppointmentTime("");
    setAppointment(null);
    setError("");
    setMessage("");
    setStep("patient");
  }

  function updatePatient(event) {
    const { name, value } = event.target;

    setPatient((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handlePatientSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (
      !patient.name.trim() ||
      !patient.age ||
      !patient.phone.trim() ||
      !patient.email.trim()
    ) {
      setError("Complete all patient details.");
      return;
    }

    setLoading(true);

    try {
      const response = await savePatient({
        name: patient.name.trim(),
        age: Number(patient.age),
        phone: patient.phone.trim(),
        email: patient.email.trim(),
      });

      const id =
        response?.patientId ??
        response?.id ??
        response?.patient?.patientId ??
        response?.patient?.id;

      if (id == null) {
        throw new Error("The patient response did not include a patient ID.");
      }

      setPatientId(id);
      setAppointmentTime("");
      setStep("appointment-time");
      setMessage("Patient details saved. Enter your preferred appointment date and time.");
    } catch (requestError) {
      setError(`Could not save patient details: ${getMessage(requestError)}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleBooking(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!selectedDoctor || patientId == null) {
      setError("Please select a doctor and save your patient details first.");
      return;
    }

    if (!appointmentTime) {
      setError("Please enter an appointment date and time.");
      return;
    }

    // datetime-local provides local wall-clock time as YYYY-MM-DDTHH:mm.
    // Send it without converting it to UTC.
    const selectedDate = new Date(appointmentTime);

    if (Number.isNaN(selectedDate.getTime())) {
      setError("Enter a valid appointment date and time.");
      return;
    }

    if (selectedDate.getTime() <= Date.now()) {
      setError("Please choose a future appointment date and time.");
      return;
    }

    setLoading(true);

    try {
      const response = await bookAppointment({
        patientId: Number(patientId),
        doctorId: Number(doctorId(selectedDoctor)),
        appointmentTime,
      });

      setAppointment(response);
      setStep("confirmation");
      setMessage("Your appointment request was submitted successfully.");
    } catch (requestError) {
      setError(
        requestError?.response?.status === 409
          ? "The doctor may not be available at that time. Please choose another date and time."
          : `Booking failed: ${getMessage(requestError)}`
      );
    } finally {
      setLoading(false);
    }
  }

  function goToDoctors() {
    setError("");
    setMessage("");
    setSelectedDoctor(null);
    setAppointmentTime("");
    setAppointment(null);
    setStep("doctors");
  }

  function goToPatientDetails() {
    setError("");
    setMessage("");
    setStep("patient");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-mark">+</span>
          <span>CarePoint</span>
        </a>

        <span className="topbar-note">
          Healthcare Appointment System
        </span>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {step === "register" && (
        <section className="auth-card">
          <p className="eyebrow">GET STARTED</p>
          <h1>Create your account</h1>

          <form onSubmit={handleRegister}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />

            <button
              className="button button-primary"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </section>
      )}

      
{step === "doctors" && (
  <section className="panel doctors-panel">
    <div className="doctors-heading">
      <p className="eyebrow">YOUR CARE, YOUR CHOICE</p>
      <h1>Available Doctors</h1>
      <p className="section-description">
        Choose a doctor to continue with your appointment.
      </p>
    </div>

    {loading && <p>Loading doctors…</p>}

    {!loading && doctors.length === 0 && (
      <div className="empty-doctors">
        <h2>No doctors found</h2>
        <p>Please try again later.</p>
      </div>
    )}

    <div className="doctor-grid">
      {doctors.map((doctor, index) => (
        <article
          className="doctor-card"
          key={doctorId(doctor) ?? index}
        >
          <div className="doctor-avatar" aria-hidden="true">
            +
          </div>

          <div className="doctor-info">
            <h2>{doctorName(doctor)}</h2>

            <span className="doctor-specialization">
              {doctor.specialization ??
                "Specialization not provided"}
            </span>

            <p className="doctor-id">
              Doctor ID: {doctorId(doctor) ?? "Not provided"}
            </p>
          </div>

          <button
            type="button"
            className="button button-primary doctor-select-button"
            disabled={doctorId(doctor) == null}
            onClick={() => selectDoctor(doctor)}
          >
            Select Doctor
          </button>
        </article>
      ))}
    </div>
  </section>
)}
     
{step === "patient" && (
  <section className="panel patient-panel">
    <div className="patient-heading">
      <p className="eyebrow">PATIENT INFORMATION</p>
      <h1>Patient Details</h1>
      <p className="section-description">
        Please provide your details so we can prepare your appointment.
      </p>
    </div>

    <div className="selected-doctor">
      <span className="selected-doctor-icon" aria-hidden="true">
        +
      </span>
      <div>
        <span className="selected-doctor-label">Selected doctor</span>
        <strong>{doctorName(selectedDoctor)}</strong>
      </div>
    </div>

    <form
      className="patient-form"
      onSubmit={handlePatientSubmit}
    >
      <div className="patient-field">
        <label htmlFor="patient-name">Full Name</label>
        <input
          id="patient-name"
          name="name"
          type="text"
          placeholder="Enter your full name"
          autoComplete="name"
          value={patient.name}
          onChange={updatePatient}
          required
        />
      </div>

      <div className="patient-field">
        <label htmlFor="patient-age">Age</label>
        <input
          id="patient-age"
          name="age"
          type="number"
          min="1"
          max="120"
          placeholder="Enter your age"
          value={patient.age}
          onChange={updatePatient}
          required
        />
      </div>

      <div className="patient-field">
        <label htmlFor="patient-phone">Phone Number</label>
        <input
          id="patient-phone"
          name="phone"
          type="tel"
          placeholder="Enter your phone number"
          autoComplete="tel"
          value={patient.phone}
          onChange={updatePatient}
          required
        />
      </div>

      <div className="patient-field">
        <label htmlFor="patient-email">Email Address</label>
        <input
          id="patient-email"
          name="email"
          type="email"
          placeholder="Enter your email address"
          autoComplete="email"
          value={patient.email}
          onChange={updatePatient}
          required
        />
      </div>

      <div className="patient-form-actions">
        <button
          type="button"
          className="button button-outline"
          onClick={goToDoctors}
        >
          Back to Doctors
        </button>

        <button
          type="submit"
          className="button button-primary"
          disabled={loading}
        >
          {loading ? "Saving details…" : "Continue to Appointment"}
        </button>
      </div>
    </form>
  </section>
)}


      {step === "appointment-time" && (
        <section className="panel">
          <h1>Choose appointment date and time</h1>

          <p>
            Doctor: <strong>{doctorName(selectedDoctor)}</strong>
          </p>

          <p>
            Patient: <strong>{patient.name}</strong>
          </p>

          <p>
            Enter the local date and time you would prefer to visit.
          </p>

          <form onSubmit={handleBooking}>
            <label htmlFor="appointmentTime">
              Appointment date and time
            </label>

            <input
              id="appointmentTime"
              name="appointmentTime"
              type="datetime-local"
              value={appointmentTime}
              min={getLocalDateTime()}
              onChange={(event) => setAppointmentTime(event.target.value)}
              required
            />

            <p className="field-hint">
              The date and time are entered in your computer's local time zone.
            </p>

            <button
              type="button"
              className="button button-outline"
              onClick={goToPatientDetails}
            >
              Back to patient details
            </button>

            <button
              type="submit"
              className="button button-primary"
              disabled={loading}
            >
              {loading ? "Booking…" : "Confirm appointment"}
            </button>
          </form>
        </section>
      )}

      {step === "confirmation" && (
        <section className="panel">
          <h1>Appointment confirmed</h1>

          <p>Your appointment request was submitted successfully.</p>
          <p>Patient: {patient.name}</p>
          <p>Doctor: {doctorName(selectedDoctor)}</p>

          <p>
            Appointment date and time:{" "}
            {formatAppointmentTime(
              appointment?.appointmentTime ?? appointmentTime
            )}
          </p>

          <p>
            Reference:{" "}
            {appointment?.appointmentId ??
              appointment?.id ??
              "Submitted"}
          </p>

          <button
            type="button"
            className="button button-primary"
            onClick={goToDoctors}
          >
            Book another appointment
          </button>
        </section>
      )}

      <footer className="footer">
        For emergencies, contact your local emergency service.
      </footer>
    </main>
  );
}
