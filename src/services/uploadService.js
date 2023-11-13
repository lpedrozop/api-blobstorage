import {createBlockBlobFromStream, generateBlobURL} from "./blobService.js";
import {generateRandomId} from "../utils/helpers.js";
import {CreateNewCourse, getAllCourseFromDB, insertBlobMetadata, updateCourseLink} from "../models/Blob.js";
import {link} from "fs";

export const getStreamAsync = async (buffer) => {
    const intoStream = (await import('into-stream')).default;
    return intoStream(buffer);
};
export const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, '');
    return `${identifier}-${originalName}`;
};



export const uploadCourse = async (datosCurso, secciones ) => {


    const curso = {
        ID_profe: datosCurso.ID_profe,
        ID_curso: datosCurso.ID_curso,
        titulo: datosCurso.titulo,
        precio: datosCurso.precio,
        categoria: datosCurso.categoria,
        palabrasClave: datosCurso.palabrasClave,
        descripcion: datosCurso.descripcion,
        secciones: secciones,
    };

    await CreateNewCourse(curso, datosCurso.palabrasClave, secciones);

}

export const uploadSingleFile = async (file, ID_curso, containerName) => {
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
        ID_curso: ID_curso,
        ID_blob: generateRandomId(),
        Container: containerName,
        link: generateBlobURL(containerName, blobName),
        Fecha_Publi: new Date()
    };

    if(dataToInsert.Container === "imagenes"){
        await updateCourseLink(dataToInsert.link, ID_curso);

    }else{
        await insertBlobMetadata(dataToInsert);
    }


}


export const getAllCourse = async () => {
    return await getAllCourseFromDB();
};






