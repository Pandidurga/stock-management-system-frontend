document.addEventListener('DOMContentLoaded', function() {
    // Base URL for API endpoints
    const apiUrl = 'http://localhost:8083/api/products';

    // DOM elements
    const addButton = document.getElementById('addButton');
    const addProductModal = document.getElementById('addProductModal');
    const editProductModal = document.getElementById('editProductModal');
    const closeAddModal = document.querySelector('#addProductModal .close');
    const closeEditModal = document.querySelector('#editProductModal .close');
    const addProductForm = document.getElementById('addProductForm');
    const editProductForm = document.getElementById('editProductForm');
    const errorMessageContainer = document.getElementById('errorMessage');

    // Event listener for adding a new product
    addButton.addEventListener('click', function() {
        addProductModal.style.display = 'block'; // Show add product modal
        errorMessageContainer.textContent = ''; // Clear any previous error message
    });

    // Event listener to close add product modal
    closeAddModal.addEventListener('click', function() {
        addProductModal.style.display = 'none'; // Hide add product modal
        resetAddForm(); // Reset form inputs
        errorMessageContainer.textContent = ''; // Clear any error message
    });

    // Event listener to close edit product modal
    closeEditModal.addEventListener('click', function() {
        editProductModal.style.display = 'none'; // Hide edit product modal
        errorMessageContainer.textContent = ''; // Clear any error message
    });

    // Event listener to close modals on click outside modal
    window.addEventListener('click', function(event) {
        if (event.target == addProductModal) {
            addProductModal.style.display = 'none'; // Hide add product modal
            errorMessageContainer.textContent = ''; // Clear any error message
        } else if (event.target == editProductModal) {
            editProductModal.style.display = 'none'; // Hide edit product modal
            errorMessageContainer.textContent = ''; // Clear any error message
        }
    });

    // Function to reset add product form
    function resetAddForm() {
        document.getElementById('productName').value = '';
        document.getElementById('costPrice').value = '';
        document.getElementById('sellingPrice').value = '';
        document.getElementById('cgst').value = '';
        document.getElementById('sgst').value = '';
        document.getElementById('igst').value = '';
        document.getElementById('supplierId').value = '';
    }

    // Function to fetch products from the API and populate the table
    function fetchProducts() {
        fetch(`${apiUrl}/get-all`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch products: ${response.statusText}`);
                }
                return response.json();
            })
            .then(products => {
                const productsList = document.getElementById('productsList');
                productsList.innerHTML = ''; // Clear existing rows

                // Populate table with products
                products.forEach(product => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${product.productId}</td>
                        <td>${product.name}</td>
                        <td>${product.costPrice}</td>
                        <td>${product.sellingPrice}</td>
                        <td>${product.cgst}</td>
                        <td>${product.sgst}</td>
                        <td>${product.igst}</td>
                        <td>${product.supplier.supplierId}</td>
                        <td>
                            <button class="editBtn" data-id="${product.productId}">Edit</button>
                            <button class="deleteBtn" data-id="${product.productId}">Delete</button>
                        </td>
                    `;
                    productsList.appendChild(row);
                });

                // Add event listeners for edit/delete buttons
                addEditDeleteListeners();
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                showMessage('Failed to fetch products. Please try again later.', 'error');
            });
    }

    // Call fetchProducts function to populate the table initially
    fetchProducts();

    // Function to add event listeners for edit/delete buttons
    function addEditDeleteListeners() {
        const editButtons = document.querySelectorAll('.editBtn');
        const deleteButtons = document.querySelectorAll('.deleteBtn');

        // Event listener for edit button
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                // Fetch product details by ID and populate edit modal
                fetch(`${apiUrl}/get-by-id/${id}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to fetch product: ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then(product => {
                        document.getElementById('editProductId').value = product.productId;
                        document.getElementById('editProductName').value = product.name;
                        document.getElementById('editCostPrice').value = product.costPrice;
                        document.getElementById('editSellingPrice').value = product.sellingPrice;
                        document.getElementById('editCgst').value = product.cgst;
                        document.getElementById('editSgst').value = product.sgst;
                        document.getElementById('editIgst').value = product.igst;
                        document.getElementById('editSupplierId').value = product.supplier.supplierId;
                        editProductModal.style.display = 'block'; // Show edit product modal
                    })
                    .catch(error => {
                        console.error('Error fetching product:', error);
                        showMessage('Failed to fetch product details. Please try again later.', 'error');
                    });
            });
        });

        // Event listener for delete button
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                // Delete product by ID
                fetch(`${apiUrl}/delete/${id}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to delete product: ${response.statusText}`);
                        }
                        fetchProducts(); // Refresh product list
                        showMessage('Product deleted successfully.', 'success');
                    })
                    .catch(error => {
                        console.error('Error deleting product:', error);
                        showMessage('Failed to delete product. Please try again later.', 'error');
                    });
            });
        });
    }

    // Event listener for adding new product
    addProductForm.addEventListener('submit', function(event) {
        event.preventDefault();
    
        // Gather form data
        const name = document.getElementById('productName').value;
        const costPrice = document.getElementById('costPrice').value;
        const sellingPrice = document.getElementById('sellingPrice').value;
        const cgst = document.getElementById('cgst').value;
        const sgst = document.getElementById('sgst').value;
        const igst = document.getElementById('igst').value;
        const supplierId = document.getElementById('supplierId').value;
    
        // Create product object
        const product = {
            name,
            costPrice,
            sellingPrice,
            cgst,
            sgst,
            igst,
            supplier: {
                supplierId
            }
        };
    
        // Send POST request to add new product
        fetch(`${apiUrl}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
        .then(response => {
            if (response.ok) {
                fetchProducts(); // Refresh product list
                addProductModal.style.display = 'none'; // Hide add product modal
                resetAddForm(); // Reset form inputs
                showMessage('Product added successfully.', 'success');
                alert('Product added successfully.');
            } else if (response.status === 409) {
                response.text().then(errorMessage => {
                    showMessage(errorMessage, 'error');
                });
            } else {
                throw new Error(`Error adding product: ${response.statusText}`);
            }
        })
        .catch(error => {
            console.error('Error adding product:', error);
            showMessage(error, 'error');
        });
    });
    

     // Event listener for updating product
editProductForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Gather form data
    const productId = document.getElementById('editProductId').value;
    const name = document.getElementById('editProductName').value;
    const costPrice = document.getElementById('editCostPrice').value;
    const sellingPrice = document.getElementById('editSellingPrice').value;
    const cgst = document.getElementById('editCgst').value;
    const sgst = document.getElementById('editSgst').value;
    const igst = document.getElementById('editIgst').value;
    const supplierId = document.getElementById('editSupplierId').value;

    // Create product object
    const product = {
        productId,
        name,
        costPrice,
        sellingPrice,
        cgst,
        sgst,
        igst,
        supplier: {
            supplierId
        }
    };

    // Send PUT request to update product
    fetch(`${apiUrl}/update/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
    .then(response => {
        if (response.ok) {
            fetchProducts(); // Refresh product list
            editProductModal.style.display = 'none'; // Hide edit product modal
            showMessage('Product updated successfully.', 'success');
        } else {
            console.error('Error response status:', response.status);
            console.error('Error response message:', response.statusText);
            response.text().then(errorMessage => {
                showMessage(errorMessage, 'error');
                alert(errorMessage);
            });
        }
    })
    .catch(error => {
        console.error('Error updating product:', error);
        showMessage('Failed to update product. Please try again later.', 'error');
    });
});



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
    }
});
