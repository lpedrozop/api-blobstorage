import {config} from "dotenv";

config()

const getStorageAccountName = () => {
    const matches = /AccountName=(.*?);/.exec(process.env.AZURE_STORAGE_CONNECTION_STRING);
    return matches && matches[1] ? matches[1] : null;
};


export const PORT = process.env.PORT || 8080

export const DB_USER = process.env.DB_USER
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_HOST = process.env.DB_HOST
export const DB_DATABASE = process.env.DB_DATABASE
export const DB_PORT = process.env.DB_PORT


export {getStorageAccountName}

