import {getFilesByID, getFilesByUserID, getFilesByType} from "../models/Blob.js";
import {getAllCourse, uploadCourse, uploadSingleFile} from "../services/uploadService.js";

export const uploadCourseController = async (req, res) => {

    try {
        const {
            ID_profe,
            ID_curso,
            titulo,
            precio,
            categoria,
            descripcion,
            palabrasClave,
            secciones
        } = req.body;

        const miniaturaFile = req.files.miniatura ? req.files.miniatura[0] : null;

        if (!miniaturaFile) {
            return res.status(400).json("Archivo requerido.");
        }


        console.log('Datos recibidos en el cuerpo de la solicitud:');
        console.log('ID_curso:', ID_curso);
        console.log('ID_profe:', ID_profe);
        console.log('titulo:', titulo);
        console.log('precio:', precio);
        console.log('categoria:', categoria);
        console.log('descripcion:', descripcion);
        console.log('palabrasClave:', palabrasClave);
        console.log('secciones:', secciones);
        console.log(miniaturaFile);

        if (!palabrasClave || !Array.isArray(palabrasClave)) {
            return res.status(400).send('Palabras clave inválidas');
        }


        if (!secciones || !Array.isArray(secciones)) {
            return res.status(400).send('Secciones inválidas');
        }

        // Crear un array para almacenar errores
        const errores = [];

        const datosCurso = {
            ID_curso,
            ID_profe,
            titulo,
            precio,
            categoria,
            palabrasClave,
            descripcion,
            miniaturaFile
        };

        const datosSecciones = secciones.map(seccion => ({
            ID_Seccion: seccion.ID_Seccion,
            seccionTitulo: seccion.seccionTitulo
        }));

        if (errores.length > 0) {
            return res.status(400).json({ errores });
        }

        await uploadCourse(datosCurso, datosSecciones);
        await uploadSingleFile(miniaturaFile, ID_curso, "imagenes")
        res.status(200).json('Curso creado exitosamente');
    } catch (err) {
        console.error(err);
        res.status(201).json('Error al crear el curso');
    }
}


export const upload = async (req, res) => {
    try {
        const { ID_Seccion } = req.body;

        const videoFile = req.files.video ? req.files.video[0] : null;
        const documentoFile = req.files.documento ? req.files.documento[0] : null;

        if (!videoFile || !documentoFile) {
            return res.status(400).json("Ambos archivos son requeridos.");
        }
        // Subir video
        await uploadSingleFile(videoFile, ID_Seccion, "videos");
        // Subir documento
        await uploadSingleFile(documentoFile, ID_Seccion, "documentos");

        res.status(200).json('Archivos subidos y metadatos almacenados exitosamente');
    } catch (err) {
        console.error(err);
        res.status(500).json('Error al subir los archivos o almacenar los metadatos');
    }
}


export const getFileByUser = async (req, res) => {
    try {
        const userID = req.params.seccionID;

        // Recuperar los registros de la base de datos
        const rows = await getFilesByUserID(userID);

        // Si no se encuentran registros, devolvemos un array vacío
        if (rows.length <= 0) return res.json([]);

        // Si se encuentran registros, devolvemos todos los registros
        res.json(rows);

    } catch (e) {
        return res.status(500).json({ message: 'Error de conexión', error: e.message });
    }
};

export const getFileByID = async (req, res) => {
    try {
        const fileID = req.params.fileID;

        // Recuperar los registros de la base de datos
        const rows = await getFilesByID(fileID);

        // Si no se encuentran registros, devolvemos un array vacío
        if (rows.length <= 0) return res.json([]);

        res.json(rows);

    } catch (e) {
        return res.status(500).json({message: 'Error de conexión', error: e.message});
    }
};

export const getFileByType = async (req, res) => {
    try {
        const fileType = req.params.fileType;

        // Recuperar los registros de la base de datos
        const rows = await getFilesByType(fileType);

        // Si no se encuentran registros, devolvemos un array vacío
        if (rows.length <= 0) return res.json([]);

        res.json(rows);

    } catch (e) {
        return res.status(500).json({message: 'Error de conexión', error: e.message});
    }
};

export const getCourse = async (req, res) => {

        try {
            const course = await getAllCourse();

            if (course.length) {
                res.status(200).json(course);
            } else {
                res.status(201).json({ message: 'No se encontraron cursos para mostrar.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener los cursos.' });
        }
};