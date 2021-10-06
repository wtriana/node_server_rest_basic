const { Router } = require('express');
const { check } = require('express-validator');

const { uploadFileNew } = require('../controllers/uploads.controller');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post('/',uploadFileNew);


module.exports = router;