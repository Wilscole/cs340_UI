//Code Cited 
//starter code from osu-cs340 nodejs dev guide; 
//Adapted to fit Vendor entity
//Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Authors: George Kochera et al. 
// Date accessed: 11/8/22

// Get the objects we need to modify
let addVendorForm = document.getElementById('add-vendor-form-ajax');

// Modify the objects we need
addVendorForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-name");
    let inputAddress = document.getElementById("input-address");
    let inputPhone = document.getElementById("input-phone");
    let inputEvents = document.getElementById("input-events");
    let inputEmail = document.getElementById("input-email");


    // Get the values from the form fields
    let namveValue = inputName.value;
    let addressValue = inputAddress.value;
    let phoneValue = inputPhone.value;
    let eventsValue = inputEvents.value;
    let emailValue = inputEmail.value;


    // Put our data we want to send in a javascript object
    let data = {
        name: namveValue,
        address: addressValue,
        phone: phoneValue,
        events: eventsValue,
        email: emailValue

    }

    console.log('Data', data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-vendor-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputAddress.value = '';
            inputPhone.value = '';
            inputEmail.value = '';
            inputEvents.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Customers
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("vendor-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let eventsCell = document.createElement("TD");
    let phoneCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let addressCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");



    // Fill the cells with correct data
    idCell.innerText = newRow.vendor_id;
    nameCell.innerText = newRow.name;
    addressCell.innerText = newRow.billing_address;
    phoneCell.innerText = newRow.phone;
    eventsCell.innerText = newRow.events;
    emailCell.innerText = newRow.email
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deleteVendor(newRow.vendor_id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(eventsCell);
    row.appendChild(phoneCell);
    row.appendChild(emailCell);
    row.appendChild(addressCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.vendor_id);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.name;
    option.value = newRow.vendor_id;
    selectMenu.add(option);
}