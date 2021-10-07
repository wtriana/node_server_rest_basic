const { Router } = require('express');
const { check } = require('express-validator');

const { uploadFileNew, updateImage,viewImage } = require('../controllers/uploads.controller');
const { validCollection } = require('../helpers');
const { validateFields, validateFile } = require('../middlewares');

const router = Router();

router.post('/', validateFile, uploadFileNew);


router.put('/:collection/:id',[
    validateFile,
    check('id','id no es un mongoID').isMongoId(),
    check('collection').custom( coll => validCollection( coll, ['user','product'] ) ),
    validateFields
], updateImage);

router.get('/:collection/:id',
check('id','id no es un mongoID').isMongoId(),
check('collection').custom( coll => validCollection( coll, ['user','product'] ) ),
validateFields,
viewImage);


module.exports = router;