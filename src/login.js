document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");

    loginForm.addEventListener("submit", e => {
        e.preventDefault(); // Prevent default form submission behavior

        // Get username and password input values
        const usernameInput = loginForm.querySelector('input[type="text"]');
        const passwordInput = loginForm.querySelector('input[type="password"]');
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // Simulate login check (replace with actual validation logic)
        if (username === "peter" && password === "peter") {
            sessionStorage.setItem('loggedIn','true')
            window.location.href = "https://www.cs.drexel.edu/~dac443/spinder/main/";
        } else {
            // Display error message for invalid credentials
            setFormMessage(loginForm, "error", "Invalid username/password combination");
        }
    });
});

function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}


// Function to set an error message on an input element
function setInputError(inputElement, message) {
    // Add a CSS class to highlight the input as erroneous
    inputElement.classList.add("form__input--error");

    // Find the error message element within the input's parent element and set its text content
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

// Function to clear the error state of an input element
function clearInputError(inputElement) {
    // Remove the CSS class that highlights the input as erroneous
    inputElement.classList.remove("form__input--error");

    // Find the error message element within the input's parent element and clear its text content
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

// Execute code when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login"); // Get the login form element
    const createAccountForm = document.querySelector("#createAccount"); // Get the create account form element

    // Event listener for clicking the "Create Account" link
    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault(); // Prevent the default link behavior

        // Hide the login form and show the create account form
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    // Event listener for clicking the "Login" link
    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault(); // Prevent the default link behavior

        // Hide the create account form and show the login form
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    // Event listener for form submission (login form)
    loginForm.addEventListener("submit", e => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Perform AJAX/Fetch login (not implemented in this snippet)

        // Set an error message on the login form (simulated error)
        setFormMessage(loginForm, "error", "Invalid username/password combination");
    });

    // Loop through all elements with the class "form__input"
    document.querySelectorAll(".form__input").forEach(inputElement => {
        // Event listener for when an input element loses focus (blur event)
        inputElement.addEventListener("blur", e => {
            // Check if the input element is the signupUsername field and its length is less than 10 characters
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 10) {
                // Set an error message on the username input field
                setInputError(inputElement, "Username must be at least 10 characters in length");
            }
        });

        // Event listener for any input change within an input element
        inputElement.addEventListener("input", e => {
            // Clear the error state of the input element whenever there's input (user corrects error)
            clearInputError(inputElement);
        });
    });
});
