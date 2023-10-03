import {Router} from "express";
import uploadStrategy from '../middlewares/upload.js';
import {
    upload,
    getFileByUser,
    getFileByID,
    getFileByType
} from "../controllers/blobController.js";
const router = Router()


router.post('/upload', uploadStrategy, upload)
router.get('/files/user/:userID', getFileByUser)
router.get('/files/id/:fileID', getFileByID)
router.get('/files/type/:fileType', getFileByType)

//router.get('/imagen', imagen)

export default router;