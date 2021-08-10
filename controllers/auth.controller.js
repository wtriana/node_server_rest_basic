const { request , response } = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/generate-jwt');
const { verifyGoogle } = require('../helpers/google-verify');



const authLogin = async( req = request, res = response ) => {

    const { email, password } = req.body;
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

const googleSignIn = async (req = request, res = response ) => {
    
    try {
        const { id_token } = req.body;
        const { name, email, image} = await verifyGoogle(id_token);
        
        let user = await User.findOne({email});

        if ( !user ) {
            //si no existe usuario lo creo 
            const data = {
                name,
                email,
                password:':P',
                image,
                google:true
            }

            user = new User( data );
            await user.save();
        }

        if ( !user.status ) {
            return res.status(401).json({
                msg:'usuario inactivo comuniquese con el administrador'
            })
        }

        const token = await generateJWT( user.id , user.email );
        //console.log({user});
        return res.status(200).json({
            msg:'generación de token OK',
            user,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg:'error en la autenticación Google / token de google invalido'
        })
    }

}

module.exports = {
    authLogin,
    googleSignIn
}