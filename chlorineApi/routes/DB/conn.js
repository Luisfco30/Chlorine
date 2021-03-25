const mysql = require('mysql2');
require('dotenv').config({ path: 'variables.env' });

let conn = mysql.createConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME

});

conn.connect( error => {
    if ( error ) {
        console.log('No se pudo conectar :(', error);

    } else {
        console.log('Se inicio correctamente');

    }

});

module.exports = conn;