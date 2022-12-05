//Code Cited 
//starter code from osu-cs340 nodejs dev guide; modified to fit Customer entity
//Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Authors: George Kochera et al. 
// Date accessed: 11/8/22

// Get the objects we need to modify
let updateEventForm = document.getElementById('update-event-form-ajax');

// Modify the objects we need
updateEventForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("mySelect");
    let inputDate = document.getElementById("update-date");
    //let inputLocation = document.getElementById("update-location");

    // Get the values from the form fields

    let nameValue = inputName.value;
    let dateValue = inputDate.value;
    //let locationValue = inputLocation.value;



    // checking that all input is not null

    if (!nameValue) {
        return;
    }
    if (!dateValue) {
        return;
    }
    //if (!locationValue) {
    //    return;
    //}



    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        date: dateValue,
        //location: locationValue,

    };

    console.log('nameValue', nameValue);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-event-ajax", true);
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


function updateRow(data, eventID) {

    let parsedData = JSON.parse(data);

    let table = document.getElementById("event-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == eventID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let dateTD = updateRowIndex.getElementsByTagName("td")[2];
            //let locationTD = updateRowIndex.getElementsByTagName("td")[3];
            let newDate = new Date(parsedData[0].date).toDateString();
            dateTD.innerHTML = newDate;
            //notesTD.innerHTML = parsedData[0].notes; 
            //activeTD.innerHTML = parsedData[0].active; 
            //emailTD.innerHTML = parsedData[0].email; 
        }
    }
}