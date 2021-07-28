require('dotenv').config();//para el uso de las variables de entorno globales del archivo .env

const Server = require('./models/server');

const server = new Server();

server.listenServer();
