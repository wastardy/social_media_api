import mysql from 'mysql';

export const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '11223344',
    database: 'social',
});