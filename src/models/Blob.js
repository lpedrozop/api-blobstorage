import { conectar } from '../config/configDB.js';

const insertBlobMetadata = async (data) => {
    const sql = 'INSERT INTO blobstorage (ID_UsuarioB2C, ID_contenido, Titulo, Container, link, Fecha_Publi) VALUES (?, ?, ?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
        conectar.query(sql, [data.ID_UsuarioB2C, data.ID_contenido, data.Titulo, data.Container, data.link, data.Fecha_Publi], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

const getFilesByUserID = async (userID) => {
    const sql = 'SELECT * FROM blobstorage WHERE ID_UsuarioB2C = ?';

    return new Promise((resolve, reject) => {
        conectar.query(sql, [userID], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

const getFilesByID = async (fileID) => {
    const sql = 'SELECT * FROM blobstorage WHERE ID_contenido = ?';

    return new Promise((resolve, reject) => {
        conectar.query(sql, [fileID], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

const getFilesByType = async (fileType) => {
    const sql = 'SELECT * FROM blobstorage WHERE Container = ?';

    return new Promise((resolve, reject) => {
        conectar.query(sql, [fileType], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};


export { insertBlobMetadata, getFilesByUserID, getFilesByID, getFilesByType };
