const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name:{
        type: String,
        uppercase: true,
        required: [true,'the name is required']
    },
    email:{
        type: String,
        required: [true,'the E-mail is mandatory'],
        unique: true
    },
    password:{
        type: String,
        required: [true,'The password is required']
    },
    image: {
        type: String,
    },
    role:{
        type: String,
        required:false,
        default: 'USER_ROLE',
        emun:['ADMIN_ROLE','USER_ROLE']
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

/** en este caso en especial la función debe ser normal no de flecha para poder 
 * usar el this */ 

userSchema.methods.toJSON = function () {
    const {__v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model( 'User', userSchema );