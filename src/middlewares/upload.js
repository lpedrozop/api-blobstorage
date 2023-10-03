import multer from 'multer';

const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({
    storage: inMemoryStorage
}).fields([
    { name: 'video', maxCount: 1 },
    { name: 'documento', maxCount: 1 }
]);

export default uploadStrategy;