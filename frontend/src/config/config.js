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
// Check if we're on Heroku (production) or local development
const isHeroku = window.location.hostname.includes('herokuapp.com') || 
                 window.location.hostname.includes('podcast-backend') ||
                 process.env.NODE_ENV === 'production';

const environment = isHeroku ? "production" : "development";

// Debug logging
console.log('🔧 Environment Detection:', {
  hostname: window.location.hostname,
  isHeroku,
  environment,
  apiUrl: config[environment].API_BASE_URL
});

// Export the configuration for the current environment
export const currentConfig = config[environment];

export default currentConfig;
