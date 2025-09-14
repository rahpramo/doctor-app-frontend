// services/data.js
import { getAuthHeaders, strapi } from "../utils/utility";
import { handleApiError } from "../utils/errorHandler";
import { API_ENDPOINTS } from "../utils/constants";

// Generic API call function
const makeApiCall = async (method, endpoint, data = null, params = {}) => {
  try {
    const config = {
      headers: getAuthHeaders(),
      params
    };

    let response;
    switch (method.toLowerCase()) {
      case 'get':
        response = await strapi.get(endpoint, config);
        break;
      case 'post':
        response = await strapi.post(endpoint, data, config);
        break;
      case 'put':
        response = await strapi.put(endpoint, data, config);
        break;
      case 'delete':
        response = await strapi.delete(endpoint, config);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return {
      success: true,
      data: response.data.data || response.data,
      meta: response.data.meta
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// User-related functions
export const fetchCurrentUser = async () => {
  return makeApiCall('get', API_ENDPOINTS.AUTH.CURRENT_USER);
};

// Doctor-related functions
export const fetchDoctors = async (params = {}) => {
  return makeApiCall('get', API_ENDPOINTS.DOCTORS, null, {
    populate: '*',
    ...params
  });
};

export const fetchDoctorById = async (id, params = {}) => {
  return makeApiCall('get', `${API_ENDPOINTS.DOCTORS}/${id}`, null, {
    populate: '*',
    ...params
  });
};

export const createDoctor = async (doctorData) => {
  return makeApiCall('post', API_ENDPOINTS.DOCTORS, { data: doctorData });
};

// Appointment-related functions
export const fetchAppointments = async (params = {}) => {
  return makeApiCall('get', API_ENDPOINTS.APPOINTMENTS, null, {
    populate: '*',
    ...params
  });
};

export const createAppointment = async (appointmentData) => {
  return makeApiCall('post', API_ENDPOINTS.APPOINTMENTS, { 
    data: appointmentData 
  });
};

export const updateAppointment = async (id, appointmentData) => {
  return makeApiCall('put', `${API_ENDPOINTS.APPOINTMENTS}/${id}`, { 
    data: appointmentData 
  });
};

export const deleteAppointment = async (id) => {
  return makeApiCall('delete', `${API_ENDPOINTS.APPOINTMENTS}/${id}`);
};


export const fetchAppointmentsByUser = async (email) => {
  return makeApiCall('get', API_ENDPOINTS.APPOINTMENTS, null, {
    populate: '*',
    filters: {
      userEmail: {
        $eq: email
      }
    }
  });
};