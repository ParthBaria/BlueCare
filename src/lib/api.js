import axios from 'axios';

const API_BASE_URL = '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData, password) => api.post('/auth/register', { ...userData, password }),
  getCurrentUser: () => api.get('/auth/me'),
};

export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  assignPatientToDoctor: (patientId, doctorId) =>
    api.put(`/users/${patientId}/assign-doctor`, { doctorId }),
  getDoctorPatients: (doctorId) => api.get(`/users/doctor/${doctorId}/patients`),
};

export const appointmentsAPI = {
  createAppointment: (appointmentData) => api.post('/appointments', appointmentData),
  getAppointments: (params) => api.get('/appointments', { params }),
  getAppointmentById: (id) => api.get(`/appointments/${id}`),
  updateAppointment: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
  cancelAppointment: (id) => api.delete(`/appointments/${id}`),
};

export const medicalRecordsAPI = {
  createRecord: (recordData) => api.post('/medical-records', recordData),
  getRecords: (params) => api.get('/medical-records', { params }),
  getRecordById: (id) => api.get(`/medical-records/${id}`),
  updateRecord: (id, recordData) => api.put(`/medical-records/${id}`, recordData),
  deleteRecord: (id) => api.delete(`/medical-records/${id}`),
};

export const prescriptionsAPI = {
  createPrescription: (prescriptionData) => api.post('/prescriptions', prescriptionData),
  getPrescriptions: (params) => api.get('/prescriptions', { params }),
  getPrescriptionById: (id) => api.get(`/prescriptions/${id}`),
  updatePrescription: (id, prescriptionData) => api.put(`/prescriptions/${id}`, prescriptionData),
  deletePrescription: (id) => api.delete(`/prescriptions/${id}`),
};

export default api;