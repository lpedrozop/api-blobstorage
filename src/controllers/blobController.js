import {getFilesByID, getFilesByUserID, getFilesByType} from "../models/Blob.js";
import {uploadSingleFile} from "../services/uploadService.js";
import validator from "validator";


export const upload = async (req, res) => {
    try {
        //const { id_usuario } = req.body;

        // Validar id_usuario
        /*if (!id_usuario || !validator.isUUID(id_usuario)) {
            return res.status(400).send('ID de usuario inválido');
        }*/

        // Validar y scanear el título
        let titulo = req.body.titulo;
        if (!titulo || titulo.length > 255) {
            return res.status(400).send('Título inválido');
        }
        titulo = validator.escape(titulo)

        const videoFile = req.files.video ? req.files.video[0] : null;
        const documentoFile = req.files.documento ? req.files.documento[0] : null;

        if (!videoFile || !documentoFile) {
            return res.status(400).json("Ambos archivos son requeridos.");
        }

        // Subir video
        await uploadSingleFile(videoFile, 123456, "videos", titulo);
        // Subir documento
        await uploadSingleFile(documentoFile, 123456, "documentos", titulo);

        res.status(200).json('Archivos subidos y metadatos almacenados exitosamente');
    } catch (err) {
        console.error(err);
        res.status(500).json('Error al subir los archivos o almacenar los metadatos');
    }
}


/*export const imagen = (req, res) => {
    try{
        const containerName = "imagenes"
        listBlobsSegmented(containerName, null, (err, data) => {
            if(err){
                console.log(err);
            }else{
                let images = '';
                if(data.entries.length){
                    data.entries.forEach(element =>{
                        images += `<img src="https://storagexvilearn.blob.core.windows.net/imagenes/9433476956205569-graphviz (1).png" width="400"  alt="300"/>`;
                    });

                    res.send(images)
                }

            }
        })
    }
    catch (e) {
        return res.status(500).json({message: 'Error de conexión'})

    }

}*/

export const getFileByUser = async (req, res) => {
    try {
        const userID = req.params.userID;

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