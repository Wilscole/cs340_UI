//Code Cited 
//starter code from osu-cs340 nodejs dev guide; modified to fit Customer entity
//Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Authors: George Kochera et al. 
// Date accessed: 11/8/22

// Get the objects we need to modify
let updateCustMemForm = document.getElementById('update-cust-mem-form-ajax');

// Modify the objects we need
updateCustMemForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustMem = document.getElementById("mySelectCustMem");
    let inputCustId = document.getElementById("update-cust-id");
    let inputLocation = document.getElementById("update-location");
    let inputMembershipFee = document.getElementById("update-membership-fee");
    let inputAddOnId = document.getElementById("update-add-on-id")

    // Get the values from the form fields

    let custMemValue = inputCustMem.value;
    let custIdValue = inputCustId.value;
    let locationValue = inputLocation.value;
    let membershipFeeValue = inputMembershipFee.value;
    let addOnIdValue = inputAddOnId.value;

    if (addOnIdValue === "NO ADD ON" || addOnIdValue === ""){
      addOnIdValue = "Null";
    }



    
    // checking that all input is not null


    if (isNaN(locationValue)) 
    {
        return;
    }
    if (isNaN(membershipFeeValue)) 
    {
        return;
    }




    // Put our data we want to send in a javascript object
    let data = {
        customer_membership_id: custMemValue,
        Customers_customer_id: custIdValue,
        Locations_location_id: locationValue,
        membership_fee: membershipFeeValue,
        add_on_id: addOnIdValue
  

    };
    
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-customer-membership-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, custMemValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    console.log(typeof(JSON.stringify(data)));
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, custMemID){
  
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("customer-membership-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == custMemID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let custIdTD = updateRowIndex.getElementsByTagName("td")[1];
            let locationTD = updateRowIndex.getElementsByTagName("td")[2];
            let membFeeTD = updateRowIndex.getElementsByTagName("td")[3];
            let addOnTD = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign homeworld to our value we updated to
            //custIdTD.innerHTML = parsedData[0].Customers_customer_id;
            custIdTD.innerHTML = parsedData[0].customer_name; 
            //locationTD.innerHTML = parsedData[0].Locations_location_id; 
            locationTD.innerHTML = parsedData[0].location_name;
            membFeeTD.innerHTML = parsedData[0].membership_fee; 
            addOnTD.innerHTML = parsedData[0].add_on_id;

       }
    }
}


