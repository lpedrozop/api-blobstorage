import userRouter from "./routes/blobRoutes.js"
import cors from 'cors'
import express from 'express'
import morgan from 'morgan';
import bodyParse from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as path from "path";
const app = express();
app.use(express.json())
app.use(morgan("common"))
app.use(cors());

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: false }));
//const __dirname = dirname(fileURLToPath(import.meta.url));
//app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(userRouter)

app.use((req, res) => {
    res.status(404).json({
        message: 'Endpoint Not Found'
    })
})


export default app;
