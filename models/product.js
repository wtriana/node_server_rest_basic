const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    name: {
        type:String,
        uppercase: true,
        required: [true, 'the name is required'],
        unique:true
    },
    state: {
        type: Boolean,
        default: true, 
        required:true
    },
    price:{
        type: Number,
        defaul:0
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    description:{ type:String,lowercase: true, },
    available:{ type:Boolean, default:true }

});

productSchema.methods.toJSON = function(){
    const {__v, status, _id, ...product } = this.toObject();
    product.uid = _id;
    return product
}

module.exports = model( 'Product', productSchema );