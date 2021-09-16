const { response } = require("express");
const { User, Category, Product, Role } = require("../models");
const { ObjectId } = require('mongoose').Types;


const collectionValid = [
    'user',
    'category',
    'product',
    'rols'
]

const searchUser = async(term = '', res = response) => {

    const isMongoId = ObjectId.isValid( term );

    if( isMongoId ){
        const user = await User.findById(term);
        return res.status(200).json( {result: (user) ? [user]: [],});
    } 

    const regex = new RegExp( term , 'i'); // aqui convertimos el termino en una exp. regular
    const users = await User.find({
        $or:[{name:regex},{email:regex}], //aqui se valida si hay un correo o nombre que cumplacon el termino de busqueda
        $and: [{status:true}]
        }
    )
    return res.status(200).json({result:users});
} 

const searchCategory = async(term = '', res = response) => {

    const isMongoId = ObjectId.isValid( term );

    if( isMongoId ){
        const category = await Category.findById(term);
        return res.status(200).json( {result: (category) ? [category]: [],});
    } 

    const regex = new RegExp( term , 'i'); // aqui convertimos el termino en una exp. regular
    const categories = await Category.find({
        $or:[{name:regex}], //aqui se valida si hay una categoria o nombre que cumplacon el termino de busqueda
        $and: [{state:true}]
        }
    )
    return res.status(200).json({result:categories});
} 

const searchProduct = async(term = '', res = response) => {

    const isMongoId = ObjectId.isValid( term );

    if( isMongoId ){
        const product = await Product.findById(term).populate('category','name');
        return res.status(200).json( {result: (product) ? [product]: [],});
    } 

    const regex = new RegExp( term , 'i'); // aqui convertimos el termino en una exp. regular
    const products = await Product.find({
        $or:[{name:regex},{description:regex}], //aqui se valida si hay un correo o nombre que cumplacon el termino de busqueda
        $and: [{state:true}]
        }
    ).populate('category','name')
    return res.status(200).json({result:products});
} 

const searchItems= async(req,res = response)=>{

    const { collection, term } =req.params;

    if (!collectionValid.includes( collection )) {
        return res.status(400).json({ info:`las colecciones pertimidas son ${collectionValid}` }) 
    }

    switch (collection) {
        
        case 'user':
            searchUser(term,res);
        break;
        case 'category':
            searchCategory(term,res);
        break;
        case 'product':
            searchProduct(term,res);
        break;
    
        default:
            res.status(500).json({
                info:'falta agregar busqueda'
            });
    }
}

module.exports = { searchItems }