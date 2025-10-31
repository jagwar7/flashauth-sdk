// References
const form = document.getElementById("signupForm");
const submitBtn = document.getElementById("submitBtn");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");


async function handleLocalSignup(serverURL, clientId) {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Reset state
    errorMessage.style.display = "none";
    successMessage.style.display = "none";
    errorMessage.textContent = "";
    successMessage.textContent = "Account created successfully!";

    // Validations
    if (!name || !email || !password || !confirmPassword) {
        showError("Please fill in all fields!");
        return;
    }

    if (password !== confirmPassword) {
        showError("Passwords do not match!");
        return;
    }

    if (password.length < 8) {
        showError("Password must be at least 8 characters long!");
        return;
    }

    // Disable button state
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
        const token = await SignUpWithJWT(serverURL, clientId, name, email, password);

        if (!token) {
            throw new Error("No token received");
        }

        Storage.Set(token);
        successMessage.style.display = "block";
        form.reset();
    } catch (error) {
        showError(error.message || "Error creating account. Please try again.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "SUBMIT";
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    handleLocalSignup(window.flashAuthServerURL, window.flashAuthClientId);
});
