// Dynamically update the year in the footer
document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Toggle password visibility
  document.querySelectorAll(".password-toggle").forEach((toggleButton) => {
    toggleButton.addEventListener("click", () => {
      const inputField = document.getElementById(toggleButton.dataset.target);
      if (inputField.type === "password") {
        inputField.type = "text";
        toggleButton.textContent = "Hide";
      } else {
        inputField.type = "password";
        toggleButton.textContent = "Show";
      }
    });
  });
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
