import {Router} from "express";
import {uploadStrategy, uploadimage} from '../middlewares/upload.js';
import {
    getFileByUser,
    getFileByID,
    getFileByType,
    uploadCourseController, upload, getCourse
} from "../controllers/blobController.js";
const router = Router()


router.post('/newcourse',uploadimage, uploadCourseController)
router.post('/upload', uploadStrategy, upload)
router.get('/course', getCourse)
router.get('/files/user/:userID', getFileByUser)
router.get('/files/id/:fileID', getFileByID)
router.get('/files/type/:fileType', getFileByType)

//router.get('/imagen', imagen)

export default   router;