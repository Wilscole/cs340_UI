//Code Cited 
//starter code from osu-cs340 nodejs dev guide; modified to fit Customer entity
//Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Authors: George Kochera et al. 
// Date accessed: 11/8/22

// Get the objects we need to modify
let updateLocationForm = document.getElementById('update-location-form-ajax');

// Modify the objects we need
updateLocationForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("mySelect");
    let inputAddress = document.getElementById("update-address");
    let inputPhone = document.getElementById("update-phone");
    let inputActive = document.getElementById("update-active");

    // Get the values from the form fields

    let nameValue = inputName.value;
    let addressValue = inputAddress.value;
    let phoneValue = inputPhone.value;
    let activeValue = inputActive.value;



    // checking that all input is not null

    if (!phoneValue) {
        return;
    }
    if (!nameValue) {
        return;
    }
    if (isNaN(activeValue)) {
        return;
    }
    if (!addressValue) {
        return;
    }



    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        address: addressValue,
        phone: phoneValue,
        active: activeValue,

    };

    console.log('nameValue', nameValue);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-location-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, nameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    console.log(typeof (JSON.stringify(data)));
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, locationID) {

    let parsedData = JSON.parse(data);

    let table = document.getElementById("location-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == locationID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let addressTD = updateRowIndex.getElementsByTagName("td")[2];
            let phoneTD = updateRowIndex.getElementsByTagName("td")[3];
            let activeTD = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign homeworld to our value we updated to
            phoneTD.innerHTML = parsedData[0].phone;
            addressTD.innerHTML = parsedData[0].address;
            activeTD.innerHTML = parsedData[0].active;
        }
    }
}
