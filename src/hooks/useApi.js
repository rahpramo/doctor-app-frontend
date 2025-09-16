// hooks/useApi.js
import {useState, useCallback} from "react";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);

      if (!result) {
        setError("No response from server");
        return {success: false, error: "No response from server"};
      }

      if (result.error || result.message) {
        const errorMessage =
          result.message || result.error || "Unknown error from server";
        setError(errorMessage);
        return {success: false, error: errorMessage};
      }

      return {success: true, data: result.data, meta: result.meta};
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      return {success: false, error: errorMessage};
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    callApi,
    clearError,
  };
};
