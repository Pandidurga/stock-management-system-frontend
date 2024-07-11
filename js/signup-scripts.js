// Base URL for the backend server
const baseURL = 'http://localhost:8083';

// Function to initialize the signup form
function initializeForm() {
    // Clear any previous error messages
    clearErrorMessages();

    // Add event listeners to input fields for dynamic validation

    // Username input field event listener for input changes
    document.getElementById('username').addEventListener('input', function() {
        validateUsernameInput(this.value);
    });

    // Email input field event listener for input changes
    document.getElementById('email').addEventListener('input', function() {
        validateEmailInput(this.value);
    });

    // Password input field event listener for input changes
    document.getElementById('password').addEventListener('input', function() {
        validatePasswordInput(this.value); 
    });

    // Contact number input field event listener for input changes
    document.getElementById('contactNumber').addEventListener('input', function() {
        validateContactNumberInput(this.value);
    });

    // Add event listener for paste events to trigger validation

    // Username input field event listener for paste events
    document.getElementById('username').addEventListener('paste', function(event) {
        // Delayed validation after paste event to allow input processing
        setTimeout(() => {
            validateUsernameInput(this.value);
        }, 0);
    });

    // Email input field event listener for paste events
    document.getElementById('email').addEventListener('paste', function(event) {
        // Delayed validation after paste event to allow input processing
        setTimeout(() => {
            validateEmailInput(this.value);
        }, 0);
    });

    // Password input field event listener for paste events
    document.getElementById('password').addEventListener('paste', function(event) {
        // Delayed validation after paste event to allow input processing
        setTimeout(() => {
            validatePasswordInput(this.value);
        }, 0);
    });

    // Contact number input field event listener for paste events
    document.getElementById('contactNumber').addEventListener('paste', function(event) {
        // Delayed validation after paste event to allow input processing
        setTimeout(() => {
            validateContactNumberInput(this.value);
        }, 0);
    });
}

// Function to clear all error messages
function clearErrorMessages() {
    // Clear error messages for each input field and signup message
    document.getElementById('usernameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('contactNumberError').textContent = '';
    document.getElementById('signupMessage').textContent = '';
}

// Function to validate the username input
function validateUsernameInput(username) {
    const usernameError = document.getElementById('usernameError');
    // Validate username format and update error message accordingly
    if (!validateUsername(username)) {
        usernameError.textContent = 'Username should be alphanumeric and may contain underscores.';
    } else {
        usernameError.textContent = ''; // Clear error message if valid
    }
}

// Function to validate the email input
function validateEmailInput(email) {
    const emailError = document.getElementById('emailError');
    // Validate email format and update error message accordingly
    if (!validateEmail(email)) {
        emailError.textContent = 'Please enter a valid email address.';
    } else {
        emailError.textContent = ''; // Clear error message if valid
    }
}

// Function to validate the password input
function validatePasswordInput(password) {
    const passwordError = document.getElementById('passwordError');
    // Validate password format and update error message accordingly
    if (!validatePassword(password)) {
        passwordError.textContent = 'Password must be at least 6 characters long and contain at least one uppercase letter, one number, and one special character.';
    } else {
        passwordError.textContent = ''; // Clear error message if valid
    }
}

// Function to validate the contact number input
function validateContactNumberInput(contactNumber) {
    const contactNumberError = document.getElementById('contactNumberError');
    // Validate contact number format and update error message accordingly
    if (!validateContactNumber(contactNumber)) {
        contactNumberError.textContent = 'Please enter a valid 10-digit contact number.';
    } else {
        contactNumberError.textContent = ''; // Clear error message if valid
    }
}

// Function to validate the username
function validateUsername(username) {
    // Regular expression to validate alphanumeric usernames with underscores
    const re = /^[a-zA-Z0-9_]+$/;
    return re.test(username); // Return true if username matches regex, false otherwise
}

// Function to validate the email address
function validateEmail(email) {
    // Regular expression to validate email format
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase()); // Return true if email matches regex, false otherwise
}

// Function to validate the password
function validatePassword(password) {
    // Regular expression to validate password format
    const re = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+[\]{}|:;"'<>,.?/~`]).{6,}$/;
    return re.test(password); // Return true if password matches regex, false otherwise
}

// Function to validate the contact number
function validateContactNumber(contactNumber) {
    // Regular expression to validate 10-digit contact numbers
    const re = /^[0-9]{10}$/;
    return re.test(contactNumber); // Return true if contact number matches regex, false otherwise
}

// Add an event listener to the signup form to handle form submission
document.getElementById('signupForm').addEventListener('submit', async function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the values from the form fields
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const contactNumber = document.getElementById('contactNumber').value;
    const state = document.getElementById('state').value;

    // Clear any previous error messages
    clearErrorMessages();

    // Flag to check if any validation error occurred
    let hasError = false;

    // Validate the username
    if (!validateUsername(username)) {
        document.getElementById('usernameError').textContent = 'Username should be alphanumeric and may contain underscores.';
        hasError = true;
    }

    // Validate the email address
    if (!validateEmail(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address.';
        hasError = true;
    }

    // Validate the password
    if (!validatePassword(password)) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters long and contain at least one uppercase letter, one number, and one special character.';
        hasError = true;
    }

    // Validate the contact number
    if (!validateContactNumber(contactNumber)) {
        document.getElementById('contactNumberError').textContent = 'Please enter a valid 10-digit contact number.';
        hasError = true;
    }

    // If any validation error occurred, return without submitting the form
    if (hasError) {
        return;
    }

    // Prepare the user object to send to the backend
    const user = {
        username,
        email,
        password,
        contactNumber,
        state
    };

    try {
        // Send a POST request to the backend server to create a new user
        const response = await fetch(`${baseURL}/api/users/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        // Handle the response from the server
        if (response.ok) {
            // Display success message if user creation is successful
            document.getElementById('signupMessage').textContent = 'User created successfully! Redirecting to Login Page...';
            document.getElementById('signupMessage').style.color = 'green';

            // Clear the form after successful submission
            document.getElementById('signupForm').reset();

            // Show success message for 2 seconds before redirecting to login page
            setTimeout(() => {
                window.location.href = 'login.html'; // Redirect to login page
            }, 2000);
        } else {
            // Display the error message returned by the server
            const errorMessage = await response.text();
            document.getElementById('signupMessage').textContent = `Error: ${errorMessage}`;
            document.getElementById('signupMessage').style.color = 'red';
        }
    } catch (error) {
        // Display any network or other errors that occurred during the request
        document.getElementById('signupMessage').textContent = `Error: ${error.message}`;
        document.getElementById('signupMessage').style.color = 'red';
    }
});

// Initialize the signup form when the script is loaded
initializeForm();
