const express = require('express');
const cors = require('cors');


const { dbConnection } = require('../database/config.db');
const fileUpload = require('express-fileupload');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth:    '/api/auth',
            category:'/api/category',
            product: '/api/product',
            uploads: '/api/uploads',
            user:    '/api/user',
            search:  '/api/search',
        }
                
        //middelwares
        this.middelwares();

        this.connectBD();

        // routes my app
        this.routes();
    }

    middelwares(){
        
        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        //diretorio publico
        this.app.use( express.static('public') );

        //carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            limits: { fileSize: 50 * 1024 * 1024 },
        }));

    }

    routes(){
        // rutas configuradas
        this.app.use(this.paths.auth, require('../routes/auth')); 
        this.app.use(this.paths.category, require('../routes/category')); 
        this.app.use(this.paths.product, require('../routes/product'));
        this.app.use(this.paths.user, require('../routes/user'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
        this.app.use(this.paths.search, require('../routes/search'));
               
    }

    async connectBD(){
        await dbConnection();
    }

    listenServer(){
        this.app.listen( this.port ,() => {
            console.log(`server listening on port: ${this.port}`)
        })
    }
}

module.exports = Server;