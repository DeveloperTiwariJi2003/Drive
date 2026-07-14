const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");


router.get('/api/files',auth,fileController.get_files);
router.post('/api/upload',auth, upload.single('data'),fileController.upload_single);
router.post('/api/uploadMany',auth, upload.array('files', 100),fileController.upload_multiple);
router.delete('/api/file/:id',auth,fileController.delete_file);
module.exports = router;