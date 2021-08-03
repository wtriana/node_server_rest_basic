const { request, response,  } = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

const OK = 200;
const CONFLIC = 409;
const BAD_REQUEST = 409;

const getUser = async(req = request, res = response) => {

    try {
        const {offset = 0, limit = 5, } =req.query;
    
        const queryParams = { status:true };

        /*
        //forma para que una las peticiones se ejecuten una seguida de la otra
        const users = await User.find(queryParams)
        .skip(Number(offset))
        .limit(Number(limit));//Number para castear  los valores a int
    
        const total = await User.countDocuments(queryParams);  
        
        res.json({users,total});
        */
        
        // aqui si no son dependientes se ejecuntan juntas a la vez
        const [total, users] = await Promise.all([
            User.countDocuments(queryParams),
            User.find(queryParams)
                .skip(Number( offset ))
                .limit(Number( limit ))
        ]);

        res.json({total,users});
        
    } catch (error) {
        console.log(error);
        res.status(CONFLIC).json(error);
    }
}

const postUser = async(req, res = response) => {

    try {
        
        const { name, email, password, image, role } = req.body;
        const salt = bcryptjs.genSaltSync();
        const user = new User({ name, email, password , role }); // creación de la instancia
        // encriptar password
        user.password = bcryptjs.hashSync(password, salt);
        // guardado del document
        await user.save(); 
        res.status(OK).json({user});
    } catch (error) {
        console.log(error);
        res.status(CONFLIC).json(error);
    }
}

const putUser = async(req, res) => {

    try {
        const id = req.params.id;

        //se extrae el _id para que no genere error al enviar a mongo
        const {_id, password, google, email,...restoBody} = req.body;//desestructuramos el body para sacar variables para validar
    
        if ( password ){
            const salt = bcryptjs.genSaltSync();
            restoBody.password = bcryptjs.hashSync(password, salt);
        }
        
        const user = await User.findByIdAndUpdate(id, restoBody);
        res.json({
            msg:'Se realiza correctamente la actualización',
            user
        });
    } catch (error) {
        res.status(CONFLIC).json(error);
    }
}

const deleteUser = async (req, res) => {

    try {


        const {id} = req.params;
        // borrado físico
        const user = await User.findByIdAndDelete( id ); 
        
        //borrado lógico
        //const user = await User.findByIdAndUpdate( id , {status:false} );
        res.status(200).json({
            msg:'Se ha borrado el usuario satisfactoriamente',
            user 
        });
    } catch (error) {
        console.log(CONFLIC,error)
        res.status(CONFLIC).json(error);
    }
    
}

const patchUser = (req, res) => {
    res.json({
        msg:'patch API controller users'
    });
}

module.exports = {
    getUser,
    postUser,
    putUser,
    deleteUser,
    patchUser
}