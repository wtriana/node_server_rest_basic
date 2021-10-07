const path = require("path");
const fs = require('fs');
const { response } = require("express");
const { uploadFile } = require('../helpers');
const { User,Product } = require('../models');

const uploadFileNew = async( req, res = response ) => {

    
    try {
        //const nameFile = await uploadFile(req.files,['txt','md'], 'file-text');
        const nameFile = await uploadFile(req.files,undefined , undefined);
        return res.status(200).json({ nameFile });

    } catch (error) {
        return res.status(400).json({ error });
    }

}

const updateImage = async ( req, res = response ) => {

    try {
        
        const { collection, id } = req.params;
        let modelo;
        switch (collection) {
            case 'user':
                modelo = await User.findById(id);
                if(!modelo){
                    return res.status(400).json({msg:`No hay usuario con el ID ${id}`});
                }
                
                break;
            case 'product':
                modelo = await Product.findById(id);
                if(!modelo){
                    return res.status(400).json({msg:`No hay producto con el ID ${id}`});
                }
                
                break;    
        
            default:
                return res.status(500).json({msg:`modelo en construcción`});
                break;
        }

        //limpiar imagenes previas
        if ( modelo.image ) {
            //borrar la img del servidor
            const pathImage = path.join(__dirname, '../assets', collection, modelo.image);
            if (fs.existsSync( pathImage )) {
                fs.unlinkSync( pathImage );
            }
        }
        
        const nameFile = await uploadFile(req.files, undefined, collection);
        modelo.image = nameFile;
        await modelo.save();
        res.status(200).json({modelo});
    } catch (error) {
        res.status(400).json({msg:error.message});
        
    }
}

const viewImage = async(req, res = response) => {
    try {
        const { collection, id } = req.params;
        let modelo;
        switch (collection) {
            case 'user':
                modelo = await User.findById(id);
                if(!modelo){
                    return res.status(400).json({msg:`No hay usuario con el ID ${id}`});
                }
                
                break;
            case 'product':
                modelo = await Product.findById(id);
                if(!modelo){
                    return res.status(400).json({msg:`No hay producto con el ID ${id}`});
                }
                
                break;    
        
            default:
                return res.status(500).json({msg:`modelo en construcción`});
                break;
        }

        if ( modelo.image ) {
            //borrar la img del servidor
            const pathImage = path.join(__dirname, '../assets', collection, modelo.image);
            modelo.image = pathImage;
            if (fs.existsSync( pathImage )) {
                return res.status(200).sendFile( pathImage );
            }
        }
        
        return  res.status(200).sendFile( path.join(__dirname, '../assets', 'img-not-available.jpg'));

    } catch (error) {
        res.status(400).json({
            msg:error.message
        });
    }

}

module.exports = {
    uploadFileNew,
    updateImage,
    viewImage
}