//Peter Judge and Coleton Wilson
//Group 11

//Code Cited 
//starter code from osu-cs340 nodejs dev guide; modified to fit Customer entity
//Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Authors: George Kochera et al. 
// Date accessed: 11/8/22

/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
const path = require('path');
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//app.use(express.static(__dirname + '/views'));

PORT = 52069;

// Database
var db = require('./database/db-connector');

// Handlebars
var exphbs = require('express-handlebars');
const { query } = require('express');
app.engine('.hbs', exphbs({
    extname: ".hbs"
}));
app.set('view engine', '.hbs');

// Static Files
app.use(express.static('public'));

/*
    ROUTES
*/


// GET ROUTES


app.get('/customers', function(req, res)
{
    let query1 = "SELECT * FROM Customers;";
    db.pool.query(query1, function(error, rows, fields){
        res.render('customers', {data: rows});
    })
});

app.get('/customer-memberships', function(req, res) 
{
    let query1 = "SELECT * FROM Customer_Memberships;";
    let query2 = "SELECT * FROM Customers;";
    let query3 = "SELECT * FROM Locations";

    db.pool.query(query1, function(error, rows, fields){

        let custMems = rows;

        db.pool.query(query2, (error, rows, fields) => {
          let customers = rows;

          db.pool.query(query3, (error, rows, fields) => {

            let locations = rows;

            // OVERWRITING CUSTOMER_ID IN CUST_MEM DATA WITH CUSTOMER FULL NAME
            let customermap = {}
            customers.map(customer => {
              let id = parseInt(customer.customer_id, 10);
              let full_name = `${customer.first_name} ${customer.last_name}`
              customermap[id] = full_name
            })




            //OVERWRITING LOCATION_ID IN CUST_MEM DATA WITH LOCATION NAME
            let locationmap = {}
            locations.map(location => {
              let id = parseInt(location.location_id, 10);
              locationmap[id] = location.name
            })


            custMems = custMems.map(custMem => {
              return Object.assign(custMem, 
                {Customers_customer_id: customermap[custMem.Customers_customer_id]},
                {Locations_location_id: locationmap[custMem.Locations_location_id]})
            })



            res.render('customer_memberships', {data: custMems, customers: customers, locations: locations});
          })

        })
        
  })

});

app.get('/vendor-locations', function(req, res) 
{
    let query1 = "SELECT * FROM Vendor_Locations;";
    let query2 = "SELECT * FROM Vendors;";
    let query3 = "SELECT * FROM Locations;";

    db.pool.query(query1, function(error, rows, fields){
        let vendorLocs = rows;

        db.pool.query(query2, function(error, rows, fields){
          let vendors = rows;

          db.pool.query(query3, function(error, rows, fields){
            let locations = rows;
            
            vendormap = {}
            locationmap = {}
            
            vendors.map(vendor => {
              let id = vendor.vendor_id
              vendormap[id] = vendor.name
            })

            locations.map(location => {
              let id = location.location_id
              locationmap[id] = location.name
            })

            vendorLocs.map(vendorLoc => {
              return Object.assign(vendorLoc, 
                {Vendors_vendor_id: vendormap[vendorLoc.Vendors_vendor_id]},
                {Locations_location_id: locationmap[vendorLoc.Locations_location_id]})
            })

            res.render('vendor_locations', {data: vendorLocs, vendors: vendors, locations: locations});
          })
        })
        
  })

});


app.get('/locations', function (req, res) {
  let query1 = "SELECT * FROM Locations;";               // Define our query


  db.pool.query(query1, function (error, rows, fields) {    // Execute the query

      res.render('locations', { data: rows });                  // Render the index.hbs file, and also send the renderer
  })                                                      // an object where 'data' is equal to the 'rows' we
});

app.get('/vendors', function (req, res) {
  let query1 = "SELECT * FROM Vendors;";               // Define our query

  db.pool.query(query1, function (error, rows, fields) {    // Execute the query

      res.render('vendors', { data: rows });                  // Render the index.hbs file, and also send the renderer
  })                                                      // an object where 'data' is equal to the 'rows' we
});

app.get('/events', function (req, res) {
  let query1 = "SELECT * FROM Events;";               // Define our query
  let query2 = "SELECT * FROM Vendor_Locations";
  let query3 = "SELECT * FROM Vendors";
  let query4 = "SELECT * FROM Locations";


  db.pool.query(query1, function (error, rows, fields) {    // Execute the query
      let events = rows

      db.pool.query(query2, function (error, rows, fields) {    // Execute the query

          let locations = rows
          db.pool.query(query3, function (error, rows, fields) {
            let vendors = rows
            
            db.pool.query(query4, function (error, rows, fields) {
              let locs = rows

              let vendorMap = {}
              let locMap = {}
              let eventVendorMap = {}
              let eventLocationMap = {}

              vendors.map(vendor => {
                let id = vendor.vendor_id
                vendorMap[id] = vendor.name
              })

              locs.map( loc => {
                let id = loc.location_id
                locMap[id] = loc.name
              })

              //need to map vendor-location-id to the corresponding vendor & event
              locations.map( location => {
                let id = location.vendor_loc_id
                eventVendorMap[id] = vendorMap[location.Vendors_vendor_id]
                eventLocationMap[id] = locMap[location.Locations_location_id]
              })

              console.log(vendorMap)
              console.log(locMap)
              console.log(locations)

              events.map (event => {
                let id = event.Vendor_Locations_vendor_loc_id
                return Object.assign(event, 
                                      {Vendor_Locations_vendor_loc_id: 
                                        `${eventVendorMap[id]} - ${eventLocationMap[id]}`})
              })

              locations.map (location => {
                let id = location.vendor_loc_id
                return Object.assign(location, 
                                      {Vendors_vendor_id: vendorMap[location.Vendors_vendor_id]},
                                        {Locations_location_id: locMap[location.Locations_location_id]})
              })
              //console.log(locations)
              res.render('events', { events: events, locations: locations, vendors: vendorMap, loc: locMap });                  // Render the index.hbs file, and also send the renderer
            })
          })
          
      
        })
  })                                                 // an object where 'data' is equal to the 'rows' we
});




// ------------ADD ROUTES----------------
// POST ROUTES FOR CUSTOMERS
app.post('/add-person-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values


    let age = parseInt(data.age);
    if (isNaN(age))
    {
        age = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (first_name, last_name, phone, notes, active, email) VALUES ('${data.first_name}', '${data.last_name}', ${data.phone}, '${data.notes}', ${data.active}, '${data.email}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Customers;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


// POST ROUTE FOR CUSTOMER MEMBERSHIPS
app.post('/add-customer-membership-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values


    let membershipFee = parseInt(data.membership_fee);
    if (isNaN(membershipFee))
    {
        membershipFee = 0
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Customer_Memberships (Customers_customer_id, Locations_location_id, membership_fee) VALUES (${data.Customers_customer_id}, ${data.Locations_location_id}, ${data.membership_fee})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people

            //query2 = `SELECT * FROM Customer_Memberships;`;
            query2 = `SELECT customer_membership_id, membership_fee, CONCAT(first_name, " ", last_name) AS full_name, name `+
            `FROM Customer_Memberships ` +
            `INNER JOIN Customers ON Customer_Memberships.Customers_customer_id = Customers.customer_id ` +
            `INNER JOIN Locations ON Customer_Memberships.Locations_location_id = Locations.location_id ` +
            `ORDER BY customer_membership_id ASC`
            db.pool.query(query2, function(error, rows, fields){
                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


// POST ROUTES FOR VENDOR LOCATIONS
app.post('/add-vendor-location-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values


    // Create the query and run it on the database
    query1 = `INSERT INTO Vendor_Locations (Vendors_vendor_id, Locations_location_id, rent) VALUES (${data.Vendors_vendor_id}, ${data.Locations_location_id}, ${data.rent})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            
            //query2 = `SELECT * FROM Vendor_Locations;`;

            query2 = `SELECT vendor_loc_id, rent, Vendors.name AS vendor_name, Locations.name AS location_name ` +
            `FROM Vendor_Locations ` +
            `INNER JOIN Vendors ON Vendor_Locations.Vendors_vendor_id = Vendors.vendor_id ` +
            `INNER JOIN Locations ON Vendor_Locations.Locations_location_id = Locations.location_id ` +
            `ORDER BY vendor_loc_id ASC `
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

//CREATES
app.post('/add-location-ajax', function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Capture NULL values


  // let age = parseInt(data.age);
  // if (isNaN(age))
  // {
  //     age = 'NULL'
  // }

  // Create the query and run it on the database
  query1 = `INSERT INTO Locations (name, address, phone, active) VALUES ('${data.name}', '${data.address}', ${data.phone}, ${data.active})`;
  db.pool.query(query1, function (error, rows, fields) {

      // Check to see if there was an error
      if (error) {

          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error)
          res.sendStatus(400);
      }
      else {
          // If there was no error, perform a SELECT * on bsg_people
          query2 = `SELECT * FROM Locations;`;
          db.pool.query(query2, function (error, rows, fields) {

              // If there was an error on the second query, send a 400
              if (error) {

                  // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  console.log(error);
                  res.sendStatus(400);
              }
              // If all went well, send the results of the query back.
              else {
                  res.send(rows);
              }
          })
      }
  })
});

app.post('/add-vendor-ajax', function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Capture NULL values



  // Create the query and run it on the database
  query1 = `INSERT INTO Vendors (name, events, phone, email, billing_address) VALUES ('${data.name}', '${data.events}', '${data.phone}', '${data.email}', '${data.address}')`;
  db.pool.query(query1, function (error, rows, fields) {

      // Check to see if there was an error
      if (error) {

          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error)
          res.sendStatus(400);
      }
      else {
          // If there was no error, perform a SELECT * on bsg_people
          query2 = `SELECT * FROM Vendors;`;
          db.pool.query(query2, function (error, rows, fields) {

              // If there was an error on the second query, send a 400
              if (error) {

                  // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  console.log(error);
                  res.sendStatus(400);
              }
              // If all went well, send the results of the query back.
              else {
                  res.send(rows);
              }
          })
      }
  })
});

app.post('/add-event-ajax', function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Capture NULL values
  console.log('locationsss', data.location)


  // Create the query and run it on the database
  query1 = `INSERT INTO Events (name, date, Vendor_Locations_vendor_loc_id) VALUES ('${data.name}', '${data.date}', '${data.location}')`;
  db.pool.query(query1, function (error, rows, fields) {

      // Check to see if there was an error
      if (error) {

          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error)
          res.sendStatus(400);
      }
      else {
          // If there was no error, perform a SELECT * on bsg_people
          
          //query2 = `SELECT * FROM Events;`;
          query2 = `SELECT event_id, Events.name as event_name, Events.date as event_date, Vendors.name as vendor_name, Locations.name as location_name ` +
          `FROM Events ` +
          `INNER JOIN Vendor_Locations ON Events.Vendor_Locations_vendor_loc_id = Vendor_Locations.vendor_loc_id ` +
          `INNER JOIN Locations ON Vendor_Locations.Locations_location_id = Locations.location_id ` +
          `INNER JOIN Vendors ON Vendor_Locations.Vendors_vendor_id = Vendors.vendor_id ` +
          `ORDER BY Events.event_id ASC` 
          db.pool.query(query2, function (error, rows, fields) {

              // If there was an error on the second query, send a 400
              if (error) {

                  // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  console.log(error);
                  res.sendStatus(400);
              }
              // If all went well, send the results of the query back.
              else {
                  res.send(rows);
              }
          })
      }
  })
});


//----------------------DELETE ROUTES--------------------

app.delete('/delete-person-ajax/', function(req,res,next){                                                                
  let data = req.body;
  let personID = parseInt(data.id);
  let deleteCust_Memb = `DELETE FROM Customer_Memberships WHERE Customers_customer_id = ?`;
  let deleteCustomer= `DELETE FROM Customers WHERE customer_id = ?`;


        // Run the 1st query
        db.pool.query(deleteCust_Memb, [personID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
                // Run the second query
                db.pool.query(deleteCustomer, [personID], function(error, rows, fields) {
        
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
})});

//DELETE routing for Customer Memberships

app.delete('/delete-customer-membership-ajax/', function(req,res,next){                                                                
  let data = req.body;
  console.log(data)
  let custMemId = parseInt(data.id);
  let deleteCust_Memb = `DELETE FROM Customer_Memberships WHERE customer_membership_id = ?`;


        // Run the 1st query
        db.pool.query(deleteCust_Memb, [custMemId], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            } else {
              res.sendStatus(204);
          }

})});

//DELETE routing for Vendor Locations

app.delete('/delete-vendor-location-ajax/', function(req,res,next){                                                                
  let data = req.body;
  console.log(data)
  let vendorLocId = parseInt(data.id);
  let deleteVendorLoc = `DELETE FROM Vendor_Locations WHERE vendor_loc_id = ?`;


        // Run the 1st query
        db.pool.query(deleteVendorLoc, [vendorLocId], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            } else {
              res.sendStatus(204);
          }

})});


//DELETES
app.delete('/delete-location-ajax/', function (req, res, next) {
  let data = req.body;
  let locationID = parseInt(data.id);
  let deleteCust_Memb = `DELETE FROM Customer_Memberships WHERE Locations_location_id = ?`;
  let deleteCustomer = `DELETE FROM Locations WHERE location_id = ?`;
  let deleteVendor_Loc = `DELETE FROM Vendor_Locations WHERE Locations_location_id = ?`;




  // Run the 1st query
  db.pool.query(deleteCust_Memb, [locationID], function (error, rows, fields) {
      if (error) {

          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error);
          res.sendStatus(400);
      }

      else {
          // Run the second query
          db.pool.query(deleteCustomer, [locationID], function (error, rows, fields) {

              if (error) {
                  console.log(error);
                  res.sendStatus(400);
              } else {
                  db.pool.query(deleteVendor_Loc, [locationID], function (error, rows, fields) {
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
          })
      }
  });
});

app.delete('/delete-vendor-ajax/', function (req, res, next) {
  let data = req.body;
  let vendorID = parseInt(data.id);
  let deleteVend_Loc = `DELETE FROM Vendor_Locations WHERE Vendors_vendor_id = ?`;
  let deleteVendor = `DELETE FROM Vendors WHERE vendor_id = ?`;


  // Run the 1st query
  db.pool.query(deleteVend_Loc, [vendorID], function (error, rows, fields) {
      if (error) {

          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error);
          res.sendStatus(400);
      }

      else {
          // Run the second query
          db.pool.query(deleteVendor, [vendorID], function (error, rows, fields) {

              if (error) {
                  console.log(error);
                  res.sendStatus(400);
              } else {
                  res.sendStatus(204);
              }
          })
      }
  })
});

app.delete('/delete-event-ajax/', function (req, res, next) {
  let data = req.body;
  let eventID = parseInt(data.id);
  let deleteEvents = `DELETE FROM Events WHERE event_id = ?`;


  // Run the 1st query
  db.pool.query(deleteEvents, [eventID], function (error, rows, fields) {
      if (error) {

          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error);
          res.sendStatus(400);
      }

      else {
          // Run the second query
          res.sendStatus(204);

          // db.pool.query(deleteEvents, [eventID], function (error, rows, fields) {

          //     if (error) {
          //         console.log(error);
          //         res.sendStatus(400);
          //     } else {
          //         res.sendStatus(204);
          //     }
          // })
      }
  })
});


//------------------UPDATE HANDLERS------------------
//UPDATE HANDLER FOR CUSTOMERS
app.put('/put-person-ajax', function(req,res,next){   
  console.log(req.body);                                
  let data = req.body;
  console.log("made it")

  let person = parseInt(data.fullname);
  let active = parseInt(data.active);


  queryUpdateCustomer = `UPDATE Customers SET phone = ?, notes = ?, active = ?, email = ? WHERE Customers.customer_id = ?;`;
  selectCustomer = `SELECT * FROM Customers WHERE Customers.customer_id = ?;`

        // Run the 1st query
        db.pool.query(queryUpdateCustomer, [data.phone, data.notes, data.active, data.email, person], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return the customer data to populate the table
            else
            {
                // Run the second query
                db.pool.query(selectCustomer, [person], function(error, rows, fields) {
        
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

// UPDATE handler for Customer Memberships

app.put('/put-customer-membership-ajax', function(req,res,next){   
  console.log(req.body);                                
  let data = req.body;
  console.log("made it")

  let custMemId = parseInt(data.customer_membership_id);
  let custId = parseInt(data.Customers_customer_id);
  let locId = parseInt(data.Locations_location_id);
  let membFee = parseInt(data.membership_fee);


  queryUpdateCustMem = `UPDATE Customer_Memberships SET Customers_customer_id = ?, Locations_location_id = ?, membership_fee = ? WHERE customer_membership_id = ?;`;
  selectCustMems = `SELECT * FROM Customer_Memberships WHERE customer_membership_id = ?;`

        // Run the 1st query
        db.pool.query(queryUpdateCustMem, [custId, locId, membFee, custMemId], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return the customer data to populate the table
            else
            {
                // Run the second query
                db.pool.query(selectCustMems, [custMemId], function(error, rows, fields) {
        
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

// UPDATE handler for Vendor Locations

app.put('/put-vendor-location-ajax', function(req,res,next){   
  console.log(req.body);                                
  let data = req.body;
  console.log("made it")

  let venLocId = parseInt(data.vendor_loc_id);
  let vendorId = parseInt(data.Vendors_vendor_id);
  let locationId = parseInt(data.Locations_location_id);
  let rent = parseInt(data.rent);


  queryUpdateVendorLoc = `UPDATE Vendor_Locations SET Vendors_vendor_id = ?, Locations_location_id = ?, rent = ? WHERE vendor_loc_id = ?;`;
  selectVendorLocs = `SELECT * FROM Vendor_Locations WHERE vendor_loc_id = ?;`

        // Run the 1st query
        db.pool.query(queryUpdateVendorLoc, [vendorId, locationId, rent, venLocId], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return the customer data to populate the table
            else
            {
                // Run the second query
                db.pool.query(selectVendorLocs, [venLocId], function(error, rows, fields) {
        
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

//UPDATES
//UPDATES
app.put('/put-location-ajax', function (req, res, next) {
  console.log(req.body);
  let data = req.body;
  console.log("made it")

  let location = parseInt(data.name);
  let active = parseInt(data.active);


  queryUpdateLocation = `UPDATE Locations SET address = ?, phone = ?, active = ?  WHERE Locations.location_id = ?;`;
  selectLocation = `SELECT * FROM Locations WHERE Locations.location_id = ?;`

  // Run the 1st query
  db.pool.query(queryUpdateLocation, [data.address, data.phone, data.active, location], function (error, rows, fields) {
      if (error) {

          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error);
          res.sendStatus(400);
      }

      // If there was no error, we run our second query and return the customer data to populate the table
      else {
          // Run the second query
          db.pool.query(selectLocation, [location], function (error, rows, fields) {

              if (error) {
                  console.log(error);
                  res.sendStatus(400);
              } else {
                  res.send(rows);
              }
          })
      }
  })
});

app.put('/put-vendor-ajax', function (req, res, next) {
  console.log(req.body);
  let data = req.body;
  console.log("made it")

  let vendor = parseInt(data.name);


  queryUpdateVendor = `UPDATE Vendors SET events = ?, phone = ?, email = ?, billing_address = ?  WHERE Vendors.vendor_id = ?;`;
  selectVendor = `SELECT * FROM Vendors WHERE Vendors.vendor_id = ?;`

  // Run the 1st query
  db.pool.query(queryUpdateVendor, [data.events, data.phone, data.email, data.address, vendor], function (error, rows, fields) {
      if (error) {

          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error);
          res.sendStatus(400);
      }

      // If there was no error, we run our second query and return the customer data to populate the table
      else {
          // Run the second query
          db.pool.query(selectVendor, [vendor], function (error, rows, fields) {

              if (error) {
                  console.log(error);
                  res.sendStatus(400);
              } else {
                  res.send(rows);
              }
          })
      }
  })
});


app.put('/put-event-ajax', function (req, res, next) {
  console.log(req.body);
  let data = req.body;
  console.log("made it")

  let event = parseInt(data.name);


  queryUpdateEvent = `UPDATE Events SET date = ? WHERE Events.event_id = ?;`;
  selectEvent = `SELECT * FROM Events WHERE Events.event_id = ?;`

  // Run the 1st query
  db.pool.query(queryUpdateEvent, [data.name, data.date, event], function (error, rows, fields) {
      if (error) {

          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error);
          res.sendStatus(400);
      }

      // If there was no error, we run our second query and return the customer data to populate the table
      else {
          // Run the second query
          db.pool.query(selectEvent, [event], function (error, rows, fields) {

              if (error) {
                  console.log(error);
                  res.sendStatus(400);
              } else {
                  res.send(rows);
              }
          })
      }
  })
});

// Starting Coleton's additions



/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
