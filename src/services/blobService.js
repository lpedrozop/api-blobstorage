import azureStorage from 'azure-storage';
const blobService = azureStorage.createBlobService();
import * as config from '../config/config.js';

export const createBlockBlobFromStream = blobService.createBlockBlobFromStream.bind(blobService);
//export const listBlobsSegmented = blobService.listBlobsSegmented.bind(blobService);
export const generateBlobURL = (containerName, blobName) => {
    return `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${blobName}`;
};

