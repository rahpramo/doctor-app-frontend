// services/auth.js
import {strapi} from "../utils/utility";
import {handleApiError} from "../utils/errorHandler";
import {API_ENDPOINTS, LOCAL_STORAGE_KEYS} from "../utils/constants";

export const AuthService = {
  // Login with identifier (username/email) and password
  login: async (identifier, password) => {
    try {
      const response = await strapi.post(API_ENDPOINTS.AUTH.LOGIN, {
        identifier,
        password,
      });

      const {user, jwt} = response.data;

      // Store user data and token
      localStorage.setItem(LOCAL_STORAGE_KEYS.JWT_TOKEN, jwt);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_TYPE, user.isAdmin || false);

      return {
        success: true,
        user,
        jwt,
        message: "Login successful",
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await strapi.post(API_ENDPOINTS.AUTH.REGISTER, {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        ...(userData.isAdmin && {isAdmin: userData.isAdmin}),
      });

      const {user, jwt} = response.data;

      // Store user data and token
      localStorage.setItem(LOCAL_STORAGE_KEYS.JWT_TOKEN, jwt);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_TYPE, user.isAdmin || false);

      return {
        success: true,
        user,
        jwt,
        message: "Registration successful",
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get current user (verify if still logged in)
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.JWT_TOKEN);

      if (!token) {
        return {
          success: false,
          error: "No authentication token found",
        };
      }

      const response = await strapi.get(API_ENDPOINTS.AUTH.CURRENT_USER, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        success: true,
        user: response.data,
      };
    } catch (error) {
      // Clear invalid token
      if (error.response?.status === 401) {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.JWT_TOKEN);
      }
      return handleApiError(error);
    }
  },

  // Logout (client-side only - clear token)
  logout: () => {
    Object.values(LOCAL_STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });

    return {
      success: true,
      message: "Logged out successfully",
    };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.JWT_TOKEN);
    const user = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);

    return !!(token && user);
  },

  // Check if user is admin
  isAdmin: () => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.USER_TYPE) === "admin";
  },

  // Get stored user data
  getStoredUser: () => {
    try {
      const userData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },
};
