const BASE_URL = 'http://localhost:8083/api'; // Base URL for backend API

document.addEventListener("DOMContentLoaded", function() {
    fetchProducts(); // Fetch products when the document content is loaded
});

// Function to fetch all products from the backend API
function fetchProducts() {
    fetch(`${BASE_URL}/products/get-all`)
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            displayProducts(data); // Call displayProducts function with fetched data
        })
        .catch(error => console.error('Error fetching products:', error)); // Log error if fetch fails
}

// Function to display products in the HTML table
function displayProducts(products) {
    const productTableBody = document.getElementById('productTableBody'); // Get table body element
    productTableBody.innerHTML = ''; // Clear previous content
    products.forEach(product => {
        const row = document.createElement('tr'); // Create a new table row
        // Populate row with product data
        row.innerHTML = `
            <td>${product.productId}</td>
            <td>${product.name}</td>
            <td>${product.sellingPrice}</td>
            <td>${product.cgst}</td>
            <td>${product.sgst}</td>
            <td>${product.igst}</td>
            <td><input type="number" min="1" value="1" id="quantity-${product.productId}"></td>
            <td><button onclick="buyProduct(${product.productId})">Buy</button></td>
        `;
        productTableBody.appendChild(row); // Append row to the table body
    });
}

// Function to search products based on keyword, minPrice, and maxPrice
function searchProducts() {
    const keyword = document.getElementById('searchBox').value; // Get search keyword
    const minPrice = document.getElementById('minPrice').value; // Get minimum price
    const maxPrice = document.getElementById('maxPrice').value; // Get maximum price
    
    const url = new URL(`${BASE_URL}/products/search`); // Create URL for search endpoint
    const params = { keyword, minPrice, maxPrice }; // Create object with search parameters
    Object.keys(params).forEach(key => {
        if (params[key] !== '') {
            url.searchParams.append(key, params[key]); // Append non-empty parameters to URL
        }
    });

    fetch(url)
        .then(response => response.json()) // Parse JSON response
        .then(data => {
            displayProducts(data); // Display search results
        })
        .catch(error => console.error('Error searching products:', error)); // Log error if search fails
}

// Function to handle buying a product
async function buyProduct(productId) {
    // Get the quantity input field for the specific product
    const quantity = document.getElementById(`quantity-${productId}`).value;

    // Retrieve customer ID from session storage
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const customerId = loggedInUser.userId; // Assuming userId is stored in session

    // Construct the URL with query parameters for creating a sale
    const url = `${BASE_URL}/sales/add?customerId=${customerId}&productId=${productId}&requestedQuantity=${parseInt(quantity)}`;

    try {
        // Make a POST request to create a sale
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Handle the response from the server
        if (response.ok) {
            // If the response is successful, get the success message from the response text
            const successMessage = await response.text();
            // Display the success message to the user
            showMessage(`Success: ${successMessage}`, 'success');
        } else {
            // If the response is not successful, get the error message from the response text
            const errorMessage = await response.text();
            // Display the error message to the user
            showMessage(`${errorMessage}`, 'error');
        }
    } catch (error) {
        // Catch any network or other errors that occurred during the request
        // Display a generic error message to the user
        showMessage(`Failed to create sale. Error: ${error.message}`, 'error');
    }
}

// Function to display success or error messages
function showMessage(message, type) {
    // Get the error message element by its ID
    const messageElement = document.getElementById('errorMessage');
    // Set the text content of the message element to the provided message
    messageElement.textContent = message;
    // Make the message element visible
    messageElement.style.display = 'block';
    // Set the color of the message text based on the type ('success' or 'error')
    messageElement.style.color = type === 'success' ? 'green' : 'red';

    // Hide the message after 5 seconds
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 30000);
}

