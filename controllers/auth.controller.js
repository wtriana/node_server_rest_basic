const { request , response } = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/generate-jwt');


const authLogin = async( req = request, res = response ) => {

    const {email,password} = req.body;
    try {

        user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                msg:'Usuario / password nos son correctos'
            })
        } 

        if(!user.status){
            return res.status(400).json({
                msg:'Usuario inactivo'
            })
        } 

        validPassword = bcryptjs.compareSync(password,user.password);
        if ( !validPassword ) {
            return res.status(400).json({
                msg:'password incorrecto'
            })

        } 

        //JWT generar el token
        const token = await generateJWT( user.id , user.email );

        return res.status(200).json({
            user,
            token
        })


    } catch (error) {
        console.log(error);
        
    }
}

/*const response = (status, msg)=>{

    return res.status(500).json({
        msg:'ALGO PASO Y HA QUE DECIR AL ADMIN'
    });
}*/

module.exports = {
    authLogin,

}