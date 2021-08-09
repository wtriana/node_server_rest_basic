const { Router } = require('express');
const { check } = require('express-validator');

const { authLogin } = require('../controllers/auth.controller');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post('/login', [   
    check('email', 'NO ES UN EMAIL').isEmail(),
    check('password', 'PASSWORD ES NECESARIO').notEmpty(),
    validateFields   
] , authLogin );


module.exports = router;