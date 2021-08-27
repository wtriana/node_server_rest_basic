const { Router } = require('express');
const { check } = require('express-validator');
const { createCategory, 
        getCategories, 
        getCategoryById, 
        updateCategory,
        deleteCategory } = require('../controllers/category.controller');
    
const { categoryExistsById } = require('../helpers/db-validator');

const { validateJWT, 
    validateFields,
    hasPrivileges, 
    validateAdminRole} = require('../middlewares');

const router = Router();

// obtener todas las categorias
router.get('/', getCategories);

//obtener una categoria  por id

router.get('/:id',[
    check('id','Id no Valido').isMongoId(),
    check('id','Id no existe').custom( categoryExistsById ),
    validateFields
] ,getCategoryById );

//crear categoria post a la raiz con token valido
router.post('/', [
    validateJWT,
    hasPrivileges('ADMIN_ROLE','SALE_ROLE'),
    check('name','Nombre es obligatorio').notEmpty(),
    check('state','Estado es obligatorio').notEmpty(),
    check('state','Estado debe ser booleano').isBoolean(),
    validateFields
    ], 
    createCategory );

// put para actualizar un registro por id con token valido
router.put('/:id',[
    validateJWT,
    check('id','Id Mongo no Valido').isMongoId(),
    check('id','Id no existe en las categorias').custom( categoryExistsById ),
    check('name','nombre es requerido').notEmpty(),
    hasPrivileges('ADMIN_ROLE','SALE_ROLE'),
    validateFields
],updateCategory);

// borrado logico con token y que sea admin
router.delete('/:id', [
    validateJWT,
    check('id','Id Mongo no Valido').isMongoId(),
    check('id','Id no existe en las categorias').custom( categoryExistsById ),
    validateAdminRole,
    validateFields
], deleteCategory);


module.exports = router;