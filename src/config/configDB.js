import mysql from 'mysql2/promise'
import {
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
    DB_USER,
    DB_PASSWORD,

} from "./config.js";

const conectar = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_DATABASE

})

conectar
    .getConnection()
    .then((connection) => {
        console.log('Conexión a la base de datos exitosa');
        connection.release();
    })
    .catch((error) => {
        console.error('Error en la conexión a la base de datos:', error);
    });

export {conectar}