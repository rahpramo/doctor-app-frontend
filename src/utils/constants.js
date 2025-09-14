// Sample dates for next 7 days
export const dates = [
  {day: "THU", date: 4},
  {day: "FRI", date: 5},
  {day: "SAT", date: 6},
  {day: "SUN", date: 7},
  {day: "MON", date: 8},
  {day: "TUE", date: 9},
];

// Sample time slots
export const slots = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
];
export const filters = [
  "General physician",
  "Cardiologist",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
];

// Navigation links
export const userLinks = [
  {title: "HOME", path: "/"},
  {title: "ALL DOCTORS", path: "/doctors"},
  {title: "ABOUT", path: "/about"},
  {title: "CONTACT", path: "/contact"},
];

// Navigation links
export const adminLinks = [
  {title: "HOME", path: "/"},
  {title: "ALL DOCTORS", path: "/doctors"},
  {title: "ALL APPOINTMENTS", path: "/all-appointments"},
];

// constants/api.js
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/local',
    REGISTER: '/auth/local/register',
    CURRENT_USER: '/users/me'
  },
  DOCTORS: '/doctors',
  APPOINTMENTS: '/appointments'
};

export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Authentication failed. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER: 'Server error. Please try again later.',
  DEFAULT: 'An unexpected error occurred.'
};

export const LOCAL_STORAGE_KEYS = {
  JWT_TOKEN: 'jwtToken',
  USER_DATA: 'user',
  USER_TYPE: 'userType'
};
