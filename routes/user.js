const { Router } = require('express');
const { check } = require('express-validator');
const { isValidRole,
        emailExists, 
        userExistsById } = require('../helpers/db-validator')

const {validateAdminRole,
        validateFields,
        hasPrivileges,
        validateJWT} = require('../middlewares');
    
const { getUser,
        postUser,
        putUser,
        deleteUser,
        patchUser } = require('../controllers/user.controller');

const router = Router();

router.get('/', getUser);

// segundo parametro es un middelwares para validar los campos con check lib express-validator 
router.post('/',[
    validateJWT,
    hasPrivileges('ADMIN_ROLE','SALE_ROLE'),
    check('name','name es requerido y mínimo 5 letras').not().isEmpty().isLength({min:5}), 
    check('password','Password debe ser de 6 caracteres o más').isLength({min:6}), 
    check('email','email no valido').isEmail().custom( emailExists ), 
    //check('role','role no valido').isIn(['ADMIN_ROLE','USER_ROLE']), 
    check('role').custom( isValidRole ), //cuando el nombre de variable es igual al nombre del parametro de la función no es necesario envair el parametro, este se pasa automaticamente
    validateFields
], postUser);

router.put('/:id', [
    validateJWT,
    hasPrivileges('ADMIN_ROLE','USER_ROLE'),
    check('id',id => {return `${id} valor no valido`}).isMongoId().custom( userExistsById ),
    check('role').custom( isValidRole ),
    validateFields
],putUser);

router.delete('/:id',[
    validateJWT,
    validateAdminRole,
    check('id',id => { return `${id} valor no valido` }).isMongoId().custom( userExistsById ),
    validateFields,
], deleteUser);

router.patch('/', patchUser);

module.exports = router;  