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


export const createDoc = async () => {
  try {
    const doc1Data = [
        {
        name: "Dr. Anne Wokes",
        speciality: "Gastroenterologist",
        phone: "123 678 3311",
        email: "doc8@gmail.com",
        experience: "9 years",
        fee: "950",
        uid: "8",
        about:
          "Dr. Peter has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
         address: "24 main street, 10 clause road",
      },
      {
        name: "Dr. Aster Hyden",
        speciality: "Pediatrician",
        phone: "123 567 3311",
        email: "doc9@gmail.com",
        experience: "5 years",
        fee: "450",
        uid: "9",
        about:
          "Dr. Wilson has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
         address: "24 main street, 10 clause road",
      }
    ];
    const doc2Data = [
      {
        name: "Dr. Emily Larson",
        speciality: "Gynecologist",
        phone: "123 234 5411",
        email: "doc13@gmail.com",
        experience: "10 years",
        fee: "960",
        uid: "13",
        about:
          "Dr. Ron has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
         address: "24 main street, 10 clause road",
      },
      {
        name: "Dr. Jenifer Dwyane",
        speciality: "Gastroenterologist",
        phone: "123 234 5411",
        email: "doc15@gmail.com",
        experience: "5 years",
        fee: "500",
        uid: "15",
        about:
          "Dr. Michael has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
         address: "24 main street, 10 clause road",
      },
      {
        name: "Dr. Kari",
        speciality: "General physician",
        phone: "123 567 3311",
        email: "doc11@gmail.com",
        experience: "7 years",
        fee: "950",
        uid: "11",
        about:
          "Dr. Emily has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
         address: "24 main street, 10 clause road",
      },
      {
        name: "Dr. Matt Jamson",
        speciality: "Pediatrician",
        phone: "123 321 3311",
        email: "doc10@gmail.com",
        experience: "10 years",
        fee: "1000",
        uid: "10",
        about:
          "Dr. Michael has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
         address: "24 main street, 10 clause road",
      },
      {
        name: "Dr. Peter Fedrick",
        speciality: "Dermatologist",
        phone: "123 789 3311",
        email: "doc6@gmail.com",
        experience: "7 years",
        fee: "650",
        uid: "6",
        about:
          "Dr. Peter has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
         address: "24 main street, 10 clause road",
      },
      {
        name: "Dr. Emily Smith",
        speciality: "Dermatologist",
        phone: "123 234 2311",
        email: "doc2@gmail.com",
        experience: "4 years",
        fee: "450",
        uid: "2",
        about:
          "Dr. Emily has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
         address: "24 main street, 10 clause road",
      },
      {
        name: "Dr. John Doe",
        speciality: "Cardiologist",
        phone: "123 122 232",
        email: "doc1@gmail.com",
        experience: "3 years",
        fee: "400",
        uid: "1",
        about:
          "Dr. John has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
         address: "24 main street, 10 clause road",
      },
      {
        name: "Dr. Michael Brown",
        speciality: "Pediatrician",
        phone: "123 234 3311",
        email: "doc3@gmail.com",
        experience: "5 years",
        fee: "550",
        uid: "3",
        about:
          "Dr. Michael has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
         address: "24 main street, 10 clause road",
      },
    ];
       const created = [];

   // for (const doctor of doc2Data) {
      const response = await strapi.post("/doctors", {
        data: doc2Data[0],
      });
      created.push(response.data.data);
    //}

    return created;
  } catch (error) {
    console.error("Error creating doctors:", error.response?.data || error);
    throw error;
  }
};