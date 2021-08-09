const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const { findById } = require('../models/user');
const User = require('../models/user');

const validateJWT = async( req=request, res = response, next ) => { 
    const token = req.header('x-token');
    //console.log({token},'hay mk')

    if ( !token ){
        return res.status(401).json({
            msg:'No exite token en para validar autenticidad'
        });
    }

    try {
        //Validacion falla si el token fue manipulado,no es un token
        //el token expiro, o cambio la semilla
        const { uid, email } = jwt.verify(token, process.env.SECRET_PRIVATE_KEY);
        
        //req.uid = uid;
        const userAuth = await User.findById( uid );

        if ( !userAuth ) {
            return res.status(401).json({
                msg:'Token no válido - usiario no existe en BDs'
            });
        }

        if (!userAuth.status) {
            return res.status(401).json({
                msg:'Usuario inactivo - usiario con estado: false'
            });
        }

        req.userAuth = userAuth;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'Token Invalido'
        });
    }
}



module.exports = {
    validateJWT
}