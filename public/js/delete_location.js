//Code Cited 
//starter code from osu-cs340 nodejs dev guide; 
//Adapted to fit Location entity
//Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Authors: George Kochera et al. 
// Date accessed: 11/8/22

// code for deletePerson function using jQuery
function deleteLocation(locationID) {
  console.log(locationID)
  let link = '/delete-location-ajax/';
  let data = {
      id: locationID
  };

  $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function (result) {
          deleteRow(locationID);
      }
  });
}

//  code for deletePerson using regular javascript/xhttp
// function deletePerson(personID) {
//     // Put our data we want to send in a javascript object
//     let data = {
//         id: personID
//     };

//     // Setup our AJAX request
//     var xhttp = new XMLHttpRequest();
//     xhttp.open("DELETE", "/delete-person-ajax", true);
//     xhttp.setRequestHeader("Content-type", "application/json");

//     // Tell our AJAX request how to resolve
//     xhttp.onreadystatechange = () => {
//         if (xhttp.readyState == 4 && xhttp.status == 204) {

//             // Add the new data to the table
//             deleteRow(personID);

//         }
//         else if (xhttp.readyState == 4 && xhttp.status != 204) {
//             console.log("There was an error with the input.")
//         }
//     }
//     // Send the request and wait for the response
//     xhttp.send(JSON.stringify(data));
// }


function deleteRow(locationID) {

  let table = document.getElementById("location-table");
  for (let i = 0, row; row = table.rows[i]; i++) {
      //iterate through rows
      //rows would be accessed using the "row" variable assigned in the for loop
      if (table.rows[i].getAttribute("data-value") == locationID) {
          table.deleteRow(i);
          break;
      }
  }
}
