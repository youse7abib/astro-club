// Check for saved theme or system preference
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "light" || (!savedTheme && !prefersDark)) {
  document.documentElement.setAttribute("data-theme", "light");
} else {
  document.documentElement.setAttribute("data-theme", "dark");
}

// Function triggered by the checkbox
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

// Ensure the switch is in the correct position when the page loads
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const themeCheckbox = document.getElementById("theme-checkbox");
    if (themeCheckbox) {
      themeCheckbox.checked =
        document.documentElement.getAttribute("data-theme") === "light";
    }
  }, 100); // Slight delay to ensure the navbar component has injected
});
