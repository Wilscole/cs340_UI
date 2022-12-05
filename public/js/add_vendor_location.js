//Code Cited 
//starter code from osu-cs340 nodejs dev guide; 
//Adapted to fit Vendor Location entity
//Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Authors: George Kochera et al. 
// Date accessed: 11/8/22

// Get the objects we need to modify
let addVendorLocationForm = document.getElementById('add-vendor-location-form-ajax');

// Modify the objects we need
addVendorLocationForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputVendorId = document.getElementById("input-vendor-id");
    let inputLocationId = document.getElementById("input-location-id");
    let inputRent = document.getElementById("input-rent");


    // Get the values from the form fields
    let vendorIdValue = inputVendorId.value;
    let locationIdValue = inputLocationId.value;
    let rentValue = inputRent.value;


    // Put our data we want to send in a javascript object
    let data = {
        Vendors_vendor_id: vendorIdValue,
        Locations_location_id: locationIdValue,
        rent: rentValue

    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-vendor-location-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputVendorId.value = '';
            inputLocationId.value = '';
            inputRent.value = '';

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
    let currentTable = document.getElementById("vendor-location-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let vendorCell = document.createElement("TD");
    let locationCell = document.createElement("TD");
    let rentCell = document.createElement("TD");


    let deleteCell = document.createElement("TD");

    

    // Fill the cells with correct data
    idCell.innerText = newRow.vendor_loc_id;
    //vendorCell.innerText = newRow.Vendors_vendor_id;
    vendorCell.innerText = newRow.vendor_name;
    //locationCell.innerText = newRow.Locations_location_id;
    locationCell.innerText = newRow.location_name;
    rentCell.innerText = newRow.rent;


    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteVendorLocation(newRow.vendor_loc_id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(vendorCell);
    row.appendChild(locationCell);
    row.appendChild(rentCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.vendor_loc_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("mySelectVendorLoc");
    let option = document.createElement("option");
    option.text = newRow.vendor_loc_id;
    option.value = newRow.vendor_loc_id;
    selectMenu.add(option);
}