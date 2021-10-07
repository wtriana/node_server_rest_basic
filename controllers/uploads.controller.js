const path = require("path");
const fs = require('fs');

const axios = require('axios');

var cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");
const { uploadFile } = require('../helpers');
const { User,Product } = require('../models');
const { Buffer } = require("buffer");

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

const updateImageCloudDinary = async ( req, res = response ) => {

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
           const nombreArr = modelo.image.split('/');
           const nombre = nombreArr[nombreArr.length - 1];
           const [ public_id , extencion ] = nombre.split('.')
           //borrar la img del servidor de cloudDinary
           await cloudinary.uploader.destroy(public_id);
            
        }
        const { tempFilePath } = req.files.file;
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        modelo.image = secure_url;
        await modelo.save();
        res.status(200).json( modelo );
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
            return res.status(200).json( {url:modelo.image} );
            /*cuando la imagen esta en local*/ 
            //const pathImage = path.join(__dirname, '../assets', collection, modelo.image);
            //modelo.image = pathImage;
            //if (fs.existsSync( pathImage )) {
            //    return res.status(200).sendFile( pathImage );
            //}
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
    viewImage,
    updateImageCloudDinary
}