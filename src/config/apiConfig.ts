const DEV_BACKEND_URL = 'http://localhost:3001/api/v1'; 
const PROD_BACKEND_URL = '/api/v1'; 

export const API_BASE_URL = import.meta.env.DEV 
                            ? DEV_BACKEND_URL
                            : PROD_BACKEND_URL;

