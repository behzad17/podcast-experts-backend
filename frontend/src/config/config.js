// Configuration file for environment-specific settings
const config = {
  development: {
    API_BASE_URL: "http://localhost:8000/api",
  },
  production: {
    API_BASE_URL: "https://podcast-backend-4e5439705bd3.herokuapp.com/api",
  },
};

// Get current environment
const environment = process.env.NODE_ENV || "development";

// Export the configuration for the current environment
export const currentConfig = config[environment];

export default currentConfig;
