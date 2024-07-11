// Base URL for API
const baseUrl = 'http://localhost:8083/api';

// Wait for the DOM content to be fully loaded before executing
document.addEventListener('DOMContentLoaded', function() {
    // Call function to fetch sales data when the DOM is ready
    fetchSalesData();
});

// Function to fetch sales data for the logged-in user
function fetchSalesData() {
    // Retrieve logged-in user details from session storage
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    // Check if logged-in user or user ID is missing
    if (!loggedInUser || !loggedInUser.userId) {
        console.error('User not logged in or user ID not found in session storage.');
        return;
    }

    // Extract user ID from logged-in user object
    const userId = loggedInUser.userId;
    
    // Construct URL to fetch sales data specific to the logged-in user
    const url = `${baseUrl}/sales/get-by-user/${userId}`;

    // Perform fetch request to retrieve sales data
    fetch(url)
        .then(response => {
            // Check if the response is not successful
            if (!response.ok) {
                throw new Error('Failed to fetch sales data.');
            }
            return response.json(); // Parse response body as JSON
        })
        .then(sales => {
            // Check if the response contains an array of sales data
            if (!Array.isArray(sales)) {
                console.error('Expected an array of sales data, but received:', sales);
                return; // Exit function or handle the unexpected response
            }
            // Call function to display sales data in a table
            displaySalesTable(sales);
        })
        .catch(error => {
            console.error('Error fetching sales data:', error.message); // Log error message if fetch or parsing fails
        });
}

// Function to display sales data in a table
function displaySalesTable(sales) {
    const tableBody = document.getElementById('salesTableBody'); // Get table body element by ID
    tableBody.innerHTML = ''; // Clear existing table rows

    // Loop through each sale object in the sales array
    sales.forEach(sale => {
        const row = document.createElement('tr'); // Create a new table row element

        // Parse ISO 8601 date format to JavaScript Date object
        const saleDate = new Date(sale.saleDate);

        // Populate table row with sale data, formatted for display
        row.innerHTML = `
            <td>${sale.saleId}</td>
            <td>${sale.product.name}</td>
            <td>${sale.quantity}</td>
            <td>${sale.unitPrice}</td>
            <td>${sale.cgst}</td>
            <td>${sale.sgst}</td>
            <td>${sale.igst}</td>
            <td>${sale.netAmount}</td>
            <td>${sale.grossAmount}</td>
            <td>${saleDate.toLocaleString()}</td> 
        `;

        tableBody.appendChild(row); // Append populated row to the table body
    });
}
