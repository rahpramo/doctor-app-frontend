import axios from "axios";

const strapiApiUrl = process.env.REACT_APP_CLOUD_STRAPI_API_URL;
const strapiApiToken = process.env.REACT_APP_CLOUD_STRAPI_API_TOKEN;

export const strapi = axios.create({
  baseURL: strapiApiUrl,
  headers: {
    Authorization: `Bearer ${strapiApiToken}`,
    "Content-Type": "application/json",
  },
});

export const getAuthHeaders = () => {
  return {Authorization: `Bearer ${strapiApiToken}`};
};