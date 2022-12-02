//Code Cited 
//starter code from osu-cs340 nodejs dev guide; modified to fit Customer entity
//Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Authors: George Kochera et al. 
// Date accessed: 11/8/22

// Get the objects we need to modify
let addCustMemForm = document.getElementById('add-cust-mem-form-ajax');

// Modify the objects we need
addCustMemForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustId = document.getElementById("input-cust-id");
    let inputLocId = document.getElementById("input-loc-id");
    let inputMembFee = document.getElementById("input-memb-fee");


    // Get the values from the form fields
    let custIdValue = inputCustId.value;
    let locIdValue = inputLocId.value;
    let membFeeValue = inputMembFee.value;


    // Put our data we want to send in a javascript object
    let data = {
        Customers_customer_id: custIdValue,
        Locations_location_id: locIdValue,
        membership_fee: membFeeValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-customer-membership-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCustId.value = '';
            inputLocId.value = '';
            inputMembFee.value = '';

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
    let currentTable = document.getElementById("customer-membership-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let custIdCell = document.createElement("TD");
    let locIdCell = document.createElement("TD");
    let membFeeCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    

    // Fill the cells with correct data
    idCell.innerText = newRow.customer_membership_id;
    //custIdCell.innerText = newRow.Customers_customer_id;
    //locIdCell.innerText = newRow.Locations_location_id;
    custIdCell.innerText = newRow.full_name;
    locIdCell.innerText = newRow.name;
    membFeeCell.innerText = newRow.membership_fee;


    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteCustomerMembership(newRow.customer_membership_id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(custIdCell);
    row.appendChild(locIdCell);
    row.appendChild(membFeeCell);
    row.appendChild(deleteCell);


    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.customer_membership_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("mySelectCustMem");
    let option = document.createElement("option");
    /*option.text = newRow.first_name + ' ' +  newRow.last_name;
    option.value = newRow.customer_id;
    */
    option.text = newRow.customer_membership_id;
    option.value = newRow.customer_membership_id;
    selectMenu.add(option);
}