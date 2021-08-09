const { response, request } = require("express");


const validateAdminRole = ( req = request, res = response, next ) => {

    if( !req.userAuth ){
        return res.status(500).json({
            msg:'Se quiere verificar el role sin validar Token'
        });
    }
    
    const { role, name } = req.userAuth;
    if ( role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg:`Usuario ***${name.split(' ')[0].toLowerCase()}*** Sin Privilegios.`
        });
    }

    next();
}

const hasPrivileges = ( ...rols ) => {

    return ( req = request, res = response, next ) => {
        if( !req.userAuth ){
            return res.status(500).json({
                msg:'Se quiere verificar el role sin validar Token'
            });
        }

        if (!rols.includes( req.userAuth.role )) {
            return res.status(401).json({
                msg:`El servicio rquiere uno de los roles ${ rols }`
            });
        }

        next();
    }
}

module.exports = {
    validateAdminRole,
    hasPrivileges
}