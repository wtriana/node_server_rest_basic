const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        await mongoose.connect( process.env.MONGODB_ATLAS,{
            useNewUrlParser:true
            ,useUnifiedTopology:true
            ,useCreateIndex:true
            ,useFindAndModify:false
        })

        console.log('DataBase Online');

    } catch (error) {
        console.log(error)
        throw new Error('Error al conectar con BD de mongoDB ');
    }

}


module.exports = {
    dbConnection
}