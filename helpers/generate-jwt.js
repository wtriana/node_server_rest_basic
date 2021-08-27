const jwt= require('jsonwebtoken');


const generateJWT = ( uid = '', email = '' ) => {

    return new Promise((resolve, reject) => {
        
        const payload = { uid, email };
        //console.log(payload)
        jwt.sign( payload , process.env.SECRET_PRIVATE_KEY, {
            expiresIn:'4h'
        }, (err, token) => {
             
            if( err ) {
                console.log(error);
                reject('no se pudo generar el Token')
            } else {
                resolve(token);
            }
        });
    });
}


module.exports = {
    generateJWT,
}