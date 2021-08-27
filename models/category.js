const {model,Schema}= require('mongoose');

const CategorySchema = new Schema({
    name:{
        type:String,
        required: [true,'nombre de Categoria requerida'],
        uppercase: true,
        unique: true
    },
    state:{
        type: Boolean,
        default:true,
        required:true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    }

});

CategorySchema.methods.toJSON = function () {
    const {__v, _id, user, ...data } = this.toObject();
    data.uid = _id;
    //console.log(this.toObject());
    data.user = { name: user.name , uid: user._id} ;
    return data;
}

module.exports = model('category',CategorySchema);