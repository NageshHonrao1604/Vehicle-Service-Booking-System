/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Validate vehicle registration
 */
export const isValidVehicleRegistration = (registration: string): boolean => {
  return registration && registration.length > 0;
};

/**
 * Validate password strength
 */
export const isStrongPassword = (password: string): boolean => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonalphas = /\W/.test(password);
  const isLengthValid = password.length >= 8;

  return hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas && isLengthValid;
};

/**
 * Validate VIN format
 */
export const isValidVIN = (vin: string): boolean => {
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin.toUpperCase());
};
