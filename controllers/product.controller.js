const { request, response } = require('express');
const { Product, User, Category} = require('../models')

//get list product
const getProducts = async (req = request,res = response) => {

    try {
        const { offset = 0, limit = 5, } = req.query;
        const queryParams = { state:true };

        /*const total = await Product.countDocuments( queryParams );
        const products = await Product.find(queryParams).skip(offset).limit(limit)
        console.log(total,products);*/
        
        const [total,products] = await Promise.all([
            Product.countDocuments( queryParams ),
            Product.find(queryParams)
            .populate('user','name')
            .populate('category','name')
            .skip(Number (offset))
            .limit(Number(limit))
        ])

        return res.status(200).json({
            total,
            products
        })

    } catch (e) {
        console.error(e.message);
        return res.status(400).json({msg: e.message});   
    }

};

//get product by id
const getProductById = async (req = request,res = response) => {

    try {
        const Id = req.params.id;
        const product = await Product.findById( { _id : Id } )
                                        .populate({path:'user', select:'name'})
                                        .populate({path:'category', select:'name'});
        return res.status(200).json({product});
    } catch (e) {
        console.error(e.message);
        return res.status(400).json({msg: e.message});
    }


};

//post create product
const createProduct = async (req = request,res = response) => {

    try {
        const {state, user, ...data} = req.body;
        const ProductBD = await Product.findOne({name:data.name.toUpperCase()})
        if ( !ProductBD ) {
            data.user = req.userAuth._id
            const product = new Product(data);
            await product.save();
            return res.status(200).json({
                msj:`Producto creado con Exito`,
                product
            });
        } else {
            throw new Error(`Producto ${ ProductBD.name } ya existe en la BDs`)
        }
        
    } catch (error) {
        console.error(error.message);
        return res.status(400).json(
            {
                msg: error.message
            }
        );
    }
};

//put update product
const updateProductById = async (req = request,res = response) => {
    try {
        const { user, state,...data } = req.body;
        const { id } = req.params;
        
        data.user = req.userAuth._id
        // parametro new para que regurese el objeto ya modificado;
        const product = await Product.findByIdAndUpdate(id, data, {new:true});
        return res.status(200).json({msg:'Actualización de producto satisfactoriamente',product});
    } catch (e) {
        console.error(e.message);
        return res.status(400).json({msg: e.message});
    }
};

//delete  product change state
const deleteProductById = async (req = request,res = response) => {

    try {
        
        const { id } = req.params;
        let product = await Product.findById( { _id : id } );
        const userAuth = req.userAuth;

        if(!product.state){
            return res.status(400).json({
                msg:'Categoria ya se encuentra inactiva'
            })
        }

        product = await Product.findByIdAndUpdate( id , {state:false, user:userAuth._id}, {new:true} );
        return res.status(200).json({
            msg:'Se ha borrado el producto satisfactoriamente',
            product
        });
    } catch (e) {
        console.error(e.message);
        return res.status(400).json({msg: e.message});
    }

};


module.exports = {
    getProductById,
    getProducts,
    createProduct,
    updateProductById,
    deleteProductById,
}

