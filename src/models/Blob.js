import { conectar } from '../config/configDB.js';
import {generateRandomId} from "../utils/helpers.js";

const insertBlobMetadata = async (data) => {
    try {
        const selectSeccionSql = 'SELECT ID_Seccion FROM seccion WHERE ID_curso = ?';
        const [seccionRows] = await conectar.query(selectSeccionSql, [data.ID_curso]);

        if (seccionRows.length === 0) {
            throw new Error('No se encontró una sección para el curso especificado');
        }

        const ID_seccion = seccionRows[0].ID_Seccion;

        const insertBlobSql = 'INSERT INTO blobstorage (ID_blob, ID_Seccion, Link, Container, Fecha_Publi) VALUES (?, ?, ?, ?, ?)';
        const blobValues = [data.ID_blob, ID_seccion, data.link, data.Container, data.Fecha_Publi];

        const [result, _] = await conectar.query(insertBlobSql, blobValues);

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
const updateCourseLink = async (Link, ID_curso) => {
    try {

        console.log(Link)
        console.log(ID_curso)

        const updateCourseSql = 'UPDATE curso SET Link = ? WHERE ID_curso = ?';

        const updateValues = [Link, ID_curso];

        const [result, _] = await conectar.query(updateCourseSql, updateValues);
        if (result.affectedRows === 1) {
            console.log('Actualización exitosa');
        } else {
            console.log('No se encontró un curso con el ID especificado');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};
const getFilesByUserID = async (seccionID) => {
    const sql = 'SELECT * FROM blobstorage WHERE ID_Seccion = ?';
    return await conectar.query(sql, [seccionID]);
};

const getFilesByID = async (fileID) => {
    const sql = 'SELECT * FROM blobstorage WHERE ID_blob = ?';
    return await conectar.query(sql, [fileID]);
};

const getFilesByType = async (fileType) => {
    const sql = 'SELECT * FROM blobstorage WHERE Container = ?';
    return await conectar.query(sql, [fileType]);
};

const CreateNewCourse = async (curso, palabrasClave, secciones) => {
    const {
        ID_curso,
        ID_profe,
        titulo,
        precio,
        categoria,
        descripcion,
        container
    } = curso;

    try {
        const insertCursoSql = 'INSERT INTO curso (ID_curso, ID_profe, Titulo, Precio, Categoria, Descripcion) VALUES ( ?, ?, ?, ?, ?, ?)';
        const cursoValues = [ID_curso, ID_profe, titulo, precio, categoria, descripcion];
        await conectar.query(insertCursoSql, cursoValues);

        for (const palabraClave of palabrasClave) {
            const insertPalabraClaveSql = 'INSERT INTO palabrasclave (ID_PalabrasClave, ID_curso, PalabrasClave) VALUES (?, ?, ?)';
            const ID_palabrasClave = generateRandomId();
            const palabrasValues = [ID_palabrasClave, ID_curso, palabraClave]
            await conectar.query(insertPalabraClaveSql, palabrasValues);
        }

        for (const seccion of secciones) {
            const { ID_Seccion, seccionTitulo } = seccion;

            // Insertar datos de secciones en la tabla 'seccion' con el mismo ID de curso
            const insertSeccionSql = 'INSERT INTO seccion (ID_curso, ID_Seccion, seccionTitulo) VALUES (?, ?, ?)';
            const seccionValue = [ID_curso, ID_Seccion, seccionTitulo]
            await conectar.query(insertSeccionSql, seccionValue);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getAllCourseFromDB = async () => {
    const sql = `
    SELECT
        curso.ID_curso,
        curso.ID_profe,
        usuarioestudiante.Nombre AS EstudianteNombre,
        usuarioestudiante.Apellido AS EstudianteApellido,
        usuarioprofesor.Biografia AS ProfesorBiografia,
        curso.Titulo AS CursoTitulo,
        curso.Descripcion AS CursoDescripcion,
        curso.Precio AS CursoPrecio,
        curso.Categoria AS CursoCategoria,
        curso.Link AS CursoLink,
        GROUP_CONCAT(DISTINCT seccion.seccionTitulo) AS Secciones,
        GROUP_CONCAT(DISTINCT palabrasclave.PalabrasClave) AS PalabrasClave
    FROM usuarioestudiante
    JOIN usuarioprofesor ON usuarioestudiante.ID_Azure = usuarioprofesor.ID_Azure
    LEFT JOIN curso ON usuarioprofesor.ID_profe = curso.ID_profe
    LEFT JOIN palabrasclave ON curso.ID_curso = palabrasclave.ID_curso
    LEFT JOIN seccion ON curso.ID_curso = seccion.ID_curso
    WHERE curso.ID_profe IS NOT NULL
    GROUP BY curso.ID_curso`;

    try {
        const [rows, fields] = await conectar.execute(sql);

        // Transformar los resultados a un formato JSON deseado
        const results = rows.map(row => ({
            ID_curso: row.ID_curso,
            ID_profe: row.ID_profe,
            Nombre: row.EstudianteNombre,
            Apellido: row.EstudianteApellido,
            Biografia: row.ProfesorBiografia,
            "Titulo Curso": row.CursoTitulo,
            "Descripcion Curso": row.CursoDescripcion,
            Precio: row.CursoPrecio,
            Categoria: row.CursoCategoria,
            Miniatura: row.CursoLink,
            Secciones: row.Secciones.split(','), // Divide las secciones en un array
            PalabrasClave: row.PalabrasClave.split(',') // Divide las palabras clave en un array
        }));

        return results;
        console.log('Resultados de la consulta:', results);
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        throw error;
    }
};

export { updateCourseLink, CreateNewCourse, insertBlobMetadata, getFilesByUserID, getFilesByID, getFilesByType, getAllCourseFromDB };
