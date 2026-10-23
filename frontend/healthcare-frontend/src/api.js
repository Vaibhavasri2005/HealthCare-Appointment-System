import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export async function register(email, password) {
  const response = await api.post("/api/auth/register", {
    email,
    password,
  });

  return response.data;
}

export async function getDoctors() {
   const response = await api.get("/api/doctor");
  return response.data;
}

export async function getDoctorAvailability(doctorId) {
  const response = await api.get("/api/appointments/slots", {
    params: { doctorId },
  });
  return response.data;
}


export async function savePatient(patient) {
  const response = await api.post("/api/patients", patient);
  return response.data;
}

export async function bookAppointment(appointment) {
  const response = await api.post("/api/appointments", appointment);
  return response.data;
}



export default api;
