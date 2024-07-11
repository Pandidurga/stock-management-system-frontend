// Base URL for the backend API
const baseURL = 'http://localhost:8083';

// Add an event listener to the login form to handle the form submission
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get values from the email and password input fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Get references to the error message and login message elements
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const loginMessage = document.getElementById('loginMessage');
    
    // Clear previous error and login messages
    emailError.textContent = '';
    passwordError.textContent = '';
    loginMessage.textContent = '';

    // Initialize a flag to track if there are validation errors
    let hasError = false;

    // Validate the email format
    if (!validateEmail(email)) {
        emailError.textContent = 'Please enter a valid email address.';
        hasError = true;
    }

    // Validate the password length
    if (password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters long.';
        hasError = true;
    }

    // If there are validation errors, do not proceed with the form submission
    if (hasError) {
        return;
    }

    try {
        // Prepare URL parameters for the login request
        const params = new URLSearchParams({ email, password });

        // Send a POST request to the backend API for login
        const response = await fetch(`${baseURL}/api/users/login?${params.toString()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Check if the response is successful
        if (response.ok) {
            // Parse the JSON response to get user details
            const user = await response.json();
            console.log(user);  // Debugging: log the user object to the console
            
            // Store the user details in session storage
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                        
            // Display a success message with the user's username
            loginMessage.textContent = `Welcome ${user.username}! Redirecting...`;
            loginMessage.style.color = 'green';

            // Redirect the user to the appropriate dashboard based on their role after a delay
            setTimeout(() => {
                if (user.role) {
                    const role = user.role.roleId; // Accessing the nested role object
                    console.log('Role ID:', role);  // Debugging: log the role ID to the console
                    switch(role) {
                        case 1:
                            window.location.href = 'seller.html'; // Redirect to seller dashboard
                            break;
                        case 2:
                            window.location.href = 'customer.html'; // Redirect to customer dashboard
                            break;
                        default:
                            window.location.href = 'default-dashboard.html'; // Redirect to default dashboard if role is unknown
                            break;
                    }
                } else {
                    window.location.href = '/default-dashboard.html'; // Redirect to default dashboard if no role is found
                }
            }, 2000); // Delay for 2 seconds before redirection
        } else {
            // Display error message if the login fails
            const errorText = await response.text();
            loginMessage.textContent = `Error: ${errorText}`;
        }
    } catch (error) {
        // Display error message if there is a network or other error
        loginMessage.textContent = `Error: ${error.message}`;
    }
});

// Function to validate email format using a regular expression
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}
