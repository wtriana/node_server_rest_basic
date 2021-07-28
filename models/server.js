const express = require('express');
const cors = require('cors');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.userRoutePath = '/api/user';
                
        //middelwares
        this.middelwares();

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
        this.app.use(this.userRoutePath, require('../routes/user'));
               
    }

    listenServer(){
        this.app.listen( this.port ,() => {
            console.log(`server listening on port: ${this.port}`)
        })
    }
}

module.exports = Server;