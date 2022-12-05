//Code Cited 
//starter code from osu-cs340 nodejs dev guide; 
//Adapted to fit Customer entity
//Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Authors: George Kochera et al. 
// Date accessed: 11/8/22

// Get the objects we need to modify
let updatePersonForm = document.getElementById('update-person-form-ajax');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullName = document.getElementById("mySelect");
    let inputPhone = document.getElementById("update-phone");
    let inputNotes = document.getElementById("update-notes");
    let inputActive = document.getElementById("update-active");
    let inputEmail = document.getElementById("update-email");

    // Get the values from the form fields

    let fullNameValue = inputFullName.value;
    let phoneValue = inputPhone.value;
    let notesValue = inputNotes.value;
    let activeValue = inputActive.value;
    let emailValue = inputEmail.value;


    
    // checking that all input is not null

    if (!phoneValue) 
    {
        return;
    }
    if (!notesValue) 
    {
        return;
    }
    if (isNaN(activeValue)) 
    {
        return;
    }
    if (!emailValue) 
    {
        return;
    }



    // Put our data we want to send in a javascript object
    let data = {
        fullname: fullNameValue,
        phone: phoneValue,
        notes: notesValue,
        active: activeValue,
        email: emailValue

    };
    
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-person-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, fullNameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    console.log(typeof(JSON.stringify(data)));
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, personID){
  
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("people-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == personID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let phoneTD = updateRowIndex.getElementsByTagName("td")[3];
            let notesTD = updateRowIndex.getElementsByTagName("td")[4];
            let activeTD = updateRowIndex.getElementsByTagName("td")[5];
            let emailTD = updateRowIndex.getElementsByTagName("td")[6];

            // Reassign homeworld to our value we updated to
            phoneTD.innerHTML = parsedData[0].phone; 
            notesTD.innerHTML = parsedData[0].notes; 
            activeTD.innerHTML = parsedData[0].active; 
            emailTD.innerHTML = parsedData[0].email; 
       }
    }
}


