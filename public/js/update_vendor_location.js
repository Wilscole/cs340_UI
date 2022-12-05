//Code Cited 
//starter code from osu-cs340 nodejs dev guide; 
//Adapted to fit Vendor Location entity
//Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Authors: George Kochera et al. 
// Date accessed: 11/8/22

// Get the objects we need to modify
let updateVendorLocForm = document.getElementById('update-vendor-location-form-ajax');

// Modify the objects we need
updateVendorLocForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputVenLocId= document.getElementById("mySelectVendorLoc");
    let inputVenId = document.getElementById("update-vendor-id");
    let inputLocId = document.getElementById("update-location-id");
    let inputRent = document.getElementById("update-rent");


    // Get the values from the form fields

    let venLocIdValue = inputVenLocId.value;
    let vendorIdValue = inputVenId.value;
    let locationIdValue = inputLocId.value;
    let rentValue = inputRent.value;



    
    // checking that all input is not null


    if (isNaN(venLocIdValue)) 
    {
        return;
    }
    if (isNaN(vendorIdValue)) 
    {
        return;
    }
    if (isNaN(locationIdValue)) 
    {
        return;
    }
    if (isNaN(rentValue)) 
    {
        return;
    }



    // Put our data we want to send in a javascript object
    let data = {
        vendor_loc_id: venLocIdValue,
        Vendors_vendor_id: vendorIdValue,
        Locations_location_id: locationIdValue,
        rent: rentValue

    };
    
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-vendor-location-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, venLocIdValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    console.log(typeof(JSON.stringify(data)));
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, venLocID){
  
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("vendor-location-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == venLocID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let vendorIdTD = updateRowIndex.getElementsByTagName("td")[1];
            let locationIdTD = updateRowIndex.getElementsByTagName("td")[2];
            let rentTD = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            //vendorIdTD.innerHTML = parsedData[0].Vendors_vendor_id; 
            vendorIdTD.innerHTML = parsedData[0].vendor_name; 
            //locationIdTD.innerHTML = parsedData[0].Locations_location_id;
            locationIdTD.innerHTML = parsedData[0].location_name; 
            rentTD.innerHTML = parsedData[0].rent; 

       }
    }
}

