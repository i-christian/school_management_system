import { createSignal } from "solid-js";

export function useValidation() {
  const [errors, setErrors] = createSignal({
    emailOrPhoneError: "",
    passwordError: "",
    confirmPasswordError: "",
  });

  const validateEmail = (input: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

  const validatePhone = (input: string) =>
    /^0\d{9}$/.test(input);

  const validatePassword = (password: string, confirmPassword: string) => {
    if (password.length < 8) {
      setErrors((prev) => ({ ...prev, passwordError: "Password must be at least 8 characters long." }));
      return false;
    }
    if (password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPasswordError: "Passwords do not match." }));
      return false;
    }
    return true;
  };

  const validateEmailOrPhone = (input: string) => {
    if (!validateEmail(input) && !validatePhone(input)) {
      setErrors((prev) => ({ ...prev, emailOrPhoneError: "Please enter a valid email address or phone number." }));
      return false;
    }
    return true;
  };

  return {
    errors,
    setErrors,
    validateEmailOrPhone,
    validatePassword,
  };
}
