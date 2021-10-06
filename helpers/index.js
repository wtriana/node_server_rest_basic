const dbValidator  = require('./db-validator');
const generateJWT  = require('./generate-jwt');
const verifyGoogle = require('./google-verify');
const uploadFile   = require('./upload-file');

module.exports = {
    ...dbValidator, 
    ...generateJWT,
    ...verifyGoogle,
    ...uploadFile
}