// Dynamically update the year in the footer
document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

// Password and Confirm Password validation
document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm_password");
  const passwordErrorElement = document.getElementById("password-error");

  if (passwordInput && confirmPasswordInput && passwordErrorElement) {
    confirmPasswordInput.addEventListener("input", () => {
      if (confirmPasswordInput.value !== passwordInput.value) {
        passwordErrorElement.textContent = "Passwords do not match.";
      } else {
        passwordErrorElement.textContent = "";
      }
    });
  }
});
