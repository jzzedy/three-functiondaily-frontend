const DEV_BACKEND_URL = 'http://localhost:3001/api/v1'; // For local development
const PROD_BACKEND_URL = 'https://three-functiondaily-backend.onrender.com'; 

export const API_BASE_URL = import.meta.env.DEV 
                            ? DEV_BACKEND_URL
                            : PROD_BACKEND_URL;