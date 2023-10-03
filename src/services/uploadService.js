import {createBlockBlobFromStream, generateBlobURL} from "./blobService.js";
import {generateRandomId} from "../utils/helpers.js";
import {insertBlobMetadata} from "../models/Blob.js";

export const getStreamAsync = async (buffer) => {
    const intoStream = (await import('into-stream')).default;
    return intoStream(buffer);
};
export const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, '');
    return `${identifier}-${originalName}`;
};

export const uploadSingleFile = async (file, id_usuario, containerName, titulo) => {
    const blobName = getBlobName(file.originalname);

    const stream = await getStreamAsync(file.buffer);
    const streamLength = file.buffer.length;

    await new Promise((resolve, reject) => {
        createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });

    const dataToInsert = {
        ID_UsuarioB2C: id_usuario,
        ID_contenido: generateRandomId(),
        Titulo: titulo,
        Container: containerName,
        link: generateBlobURL(containerName, blobName),
        Fecha_Publi: new Date()
    };

    await insertBlobMetadata(dataToInsert);
}


