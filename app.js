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
    db.pool.query(query1, function(error, rows, fields){
        res.render('customer_memberships', {data: rows});
  })

});

app.get('/locations', function(req, res) {
  res.sendFile(path.join(__dirname, '/views/locations.html'));
});



app.get('/events', function(req, res) {
  res.sendFile(path.join(__dirname, '/views/events.html'));
});

app.get('/vendor-locations', function(req, res) {
  res.sendFile(path.join(__dirname, '/views/vendor_locations.html'));
});

app.get('/vendors', function(req, res) {
  res.sendFile(path.join(__dirname, '/views/vendors.html'));
});

// POST ROUTES
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
            query2 = `SELECT * FROM Customer_Memberships;`;
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


/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
