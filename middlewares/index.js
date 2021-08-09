 const validateFieldsFuntions = require('../middlewares/validate-fields');
 const validateJWTFuntions = require('../middlewares/validate-jwt');
 const validateRolsFuntions = require('../middlewares/validate-role');

 module.exports = {
    ...validateFieldsFuntions,
    ...validateJWTFuntions,
    ...validateRolsFuntions
 }

 