/**
 * URL validation helper function
 * @param {string} string - The URL string to validate
 * @returns {boolean} - True if valid URL, false otherwise
 */
export const isValidUrl = (string) => {
  if (!string || string.trim() === "") {
    return true; // Empty is valid (optional field)
  }
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

