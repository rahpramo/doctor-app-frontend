// utils/errorHandler.js

import {ERROR_MESSAGES} from "./constants";

export const handleApiError = (error) => {
  console.error("API Error:", error);

  if (!error.response) {
    return {
      success: false,
      error: ERROR_MESSAGES.NETWORK,
      status: 0,
    };
  }

  const {status, data} = error.response;
  let errorMessage = ERROR_MESSAGES.DEFAULT;

  switch (status) {
    case 400:
      errorMessage = data.error?.message || "Invalid request data";
      break;
    case 401:
      errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
      break;
    case 403:
      errorMessage = ERROR_MESSAGES.FORBIDDEN;
      break;
    case 404:
      errorMessage = ERROR_MESSAGES.NOT_FOUND;
      break;
    case 500:
      errorMessage = ERROR_MESSAGES.SERVER;
      break;
    default:
      errorMessage = data.error?.message || ERROR_MESSAGES.DEFAULT;
  }

  return {
    success: false,
    error: errorMessage,
    status,
    details: data,
  };
};

