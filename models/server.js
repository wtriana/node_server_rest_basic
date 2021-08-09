const express = require('express');
const cors = require('cors');


const { dbConnection } = require('../database/config.db');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.authPath = '/api/auth';
        this.userRoutePath = '/api/user';
                
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
        this.app.use(express.static('public'));

    }

    routes(){
        // rutas configuradas
        this.app.use(this.authPath, require('../routes/auth')); 
        this.app.use(this.userRoutePath, require('../routes/user'));
               
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