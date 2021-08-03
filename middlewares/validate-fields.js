const { validationResult } = require("express-validator");


const validateFields = ( req, res, next ) => {

    const erros = validationResult(req);
    if (!erros.isEmpty()){
        return res.status(400).json(erros);
    }

    // importante para que continue la ejecución despues de la valdiación
    next();
}

module.exports = {
    validateFields
}