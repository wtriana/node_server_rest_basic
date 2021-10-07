 const validateFieldsFuntions = require('../middlewares/validate-fields');
 const validateJWTFuntions = require('../middlewares/validate-jwt');
 const validateRolsFuntions = require('../middlewares/validate-role');
 const validateFileFuntions = require('./validate-File') 

 module.exports = {
    ...validateFieldsFuntions,
    ...validateJWTFuntions,
    ...validateRolsFuntions,
    ...validateFileFuntions
 }

 