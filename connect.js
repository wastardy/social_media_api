import mysql from 'mysql2';

export const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '@Variable2311',
    database: 'connectify',
});