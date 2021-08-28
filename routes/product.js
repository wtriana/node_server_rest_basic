const { Router } = require('express');
const { check } =require('express-validator');

const {
    getProductById,
    getProducts,
    createProduct,
    updateProductById,
    deleteProductById,
} = require('../controllers/product.controller')

const { validateJWT, 
    validateFields,
    hasPrivileges, 
    validateAdminRole} = require('../middlewares');

const { categoryExistsById, productExistsById } = require('../helpers/db-validator');

const producRouter = new Router();

producRouter.get('/',getProducts);

producRouter.get('/:id',[
    check('id','id debe ser un id mongo valido').isMongoId(),
    check('id','Id no existe en los productos').custom( productExistsById ),
    validateFields
],getProductById);

producRouter.post('/',[
    validateJWT,
    hasPrivileges('ADMIN_ROLE','SALE_ROLE'),
    check('name','nombre es obligatorio').notEmpty(),
    check('price','precio es numerico').isNumeric(), 
    check('category','id categoria debe ser un id mongo valido').isMongoId(),
    check('category','categoria no existe').custom( categoryExistsById )
    , validateFields
], createProduct);

producRouter.put('/:id',[
    validateJWT,
    check('id','id debe ser un id mongo valido').isMongoId(),
    check('id','Id no existe en los productos').custom( productExistsById ),
    check('category','categoria no existe').custom( categoryExistsById ),
    validateFields
],updateProductById);

producRouter.delete('/:id',[
    validateJWT,
    validateAdminRole,
    check('id','id debe ser un id mongo valido').isMongoId(),
    check('id','Id no existe en los productos').custom( productExistsById ),
    validateFields
], deleteProductById); 

module.exports = producRouter;