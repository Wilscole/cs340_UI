//Code Cited  12-5-2022
//starter code from osu-cs340 nodejs dev guide
//Used db.connector format from source guide
//Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Authors: George Kochera et al. 

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_judgep',
    password        : '6420',
    database        : 'cs340_judgep'
})

// Export it for use in our applicaiton
module.exports.pool = pool;
