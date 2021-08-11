const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'images');
    },
    filename (req, file, cb) {
        cb(null, `${new Date().toISOString().split(/[-:.A-Z]/).join('')}-${file.originalname.split(/\s*/).join('')}`);
    }
});

const allowedTypesArray = ['image/png', 'image/jpeg', 'image/jpg'];

const fileFilter = (req, file, cb) => {
    if (allowedTypesArray.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

module.exports = multer({
    storage,
    fileFilter
});
