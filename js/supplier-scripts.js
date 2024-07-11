document.addEventListener('DOMContentLoaded', function() {
    // Base URL for API endpoints
    const apiUrl = 'http://localhost:8083/api/suppliers';

    // DOM elements
    const addButton = document.getElementById('addButton');
    const addSupplierModal = document.getElementById('addSupplierModal');
    const editSupplierModal = document.getElementById('editSupplierModal');
    const closeAddModal = document.querySelector('#addSupplierModal .close');
    const closeEditModal = document.querySelector('#editSupplierModal .close');
    const addSupplierForm = document.getElementById('addSupplierForm');
    const editSupplierForm = document.getElementById('editSupplierForm');

    // Event listener for adding a new supplier
    addButton.addEventListener('click', function() {
        addSupplierModal.style.display = 'block'; // Show add supplier modal
    });

    // Event listener to close add supplier modal
    closeAddModal.addEventListener('click', function() {
        addSupplierModal.style.display = 'none'; // Hide add supplier modal
        resetAddForm(); // Reset form inputs
    });

    // Event listener to close edit supplier modal
    closeEditModal.addEventListener('click', function() {
        editSupplierModal.style.display = 'none'; // Hide edit supplier modal
    });

    // Event listener to close modals on click outside modal
    window.addEventListener('click', function(event) {
        if (event.target == addSupplierModal) {
            addSupplierModal.style.display = 'none'; // Hide add supplier modal
        } else if (event.target == editSupplierModal) {
            editSupplierModal.style.display = 'none'; // Hide edit supplier modal
        }
    });

    // Function to reset add supplier form
    function resetAddForm() {
        document.getElementById('supplierName').value = '';
        document.getElementById('contactNumber').value = '';
        document.getElementById('state').value = '';
    }

    // Function to fetch suppliers from the API and populate the table
    function fetchSuppliers() {
        fetch(`${apiUrl}/get-all`)
            .then(response => response.json())
            .then(suppliers => {
                const suppliersList = document.getElementById('suppliersList');
                suppliersList.innerHTML = ''; // Clear existing rows

                // Populate table with suppliers
                suppliers.forEach(supplier => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${supplier.supplierId}</td>
                        <td>${supplier.supplierName}</td>
                        <td>${supplier.contactNumber}</td>
                        <td>${supplier.state}</td>
                        <td>
                            <button class="editBtn" data-id="${supplier.supplierId}">Edit</button>
                            <button class="deleteBtn" data-id="${supplier.supplierId}">Delete</button>
                        </td>
                    `;
                    suppliersList.appendChild(row);
                });

                // Add event listeners for edit/delete buttons
                addEditDeleteListeners();
            })
            .catch(error => console.error('Error fetching suppliers:', error));
    }

    // Call fetchSuppliers function to populate the table initially
    fetchSuppliers();

    // Function to add event listeners for edit/delete buttons
    function addEditDeleteListeners() {
        const editButtons = document.querySelectorAll('.editBtn');
        const deleteButtons = document.querySelectorAll('.deleteBtn');

        // Event listener for edit button
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                // Fetch supplier details by ID and populate edit modal
                fetch(`${apiUrl}/get-by-id/${id}`)
                    .then(response => response.json())
                    .then(supplier => {
                        document.getElementById('editSupplierId').value = supplier.supplierId;
                        document.getElementById('editSupplierName').value = supplier.supplierName;
                        document.getElementById('editContactNumber').value = supplier.contactNumber;
                        document.getElementById('editState').value = supplier.state;
                        editSupplierModal.style.display = 'block'; // Show edit supplier modal
                    })
                    .catch(error => console.error('Error fetching supplier details:', error));
            });
        });

        // Event listener for delete button
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this supplier?')) {
                    // Send DELETE request to delete supplier by ID
                    fetch(`${apiUrl}/delete/${id}`, {
                        method: 'DELETE'
                    })
                    .then(response => {
                        if (response.ok) {
                            fetchSuppliers(); // Refresh table
                            alert('Supplier deleted successfully');
                        } else {
                            alert('Failed to delete supplier');
                        }
                    })
                    .catch(error => console.error('Error deleting supplier:', error));
                }
            });
        });
    }

    // Event listener for form submission to add a new supplier
    addSupplierForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // Get form input values
        const supplierName = document.getElementById('supplierName').value;
        const contactNumber = document.getElementById('contactNumber').value;
        const state = document.getElementById('state').value;

        const newSupplier = {
            supplierName: supplierName,
            contactNumber: contactNumber,
            state: state
        };

        // Send POST request to add new supplier
        fetch(`${apiUrl}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newSupplier)
        })
        .then(response => {
            if (response.ok) {
                fetchSuppliers(); // Refresh table
                addSupplierModal.style.display = 'none'; // Hide add supplier modal
                alert('Supplier added successfully');
                resetAddForm(); // Reset form inputs
            } else {
                alert('Failed to add supplier');
            }
        })
        .catch(error => console.error('Error adding supplier:', error));
    });

    // Event listener for form submission to edit a supplier
    editSupplierForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // Get form input values
        const id = document.getElementById('editSupplierId').value;
        const name = document.getElementById('editSupplierName').value;
        const contactNumber = document.getElementById('editContactNumber').value;
        const state = document.getElementById('editState').value;

        const updatedSupplier = {
            supplierName: name,
            contactNumber: contactNumber,
            state: state
        };

        // Send PUT request to update supplier by ID
        fetch(`${apiUrl}/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedSupplier)
        })
        .then(response => {
            if (response.ok) {
                fetchSuppliers(); // Refresh table
                editSupplierModal.style.display = 'none'; // Hide edit supplier modal
                alert('Supplier updated successfully');
            } else {
                alert('Failed to update supplier');
            }
        })
        .catch(error => console.error('Error updating supplier:', error));
    });

});
