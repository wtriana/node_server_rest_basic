const { response, request } = require('express');
const { Category,User } = require('../models');


//obtenerCategorias --paginado --total -- populate
const getCategories = async (req = request,res = response) => {

    try {
        const { offset = 0, limit = 5, } = req.query;
        const queryParams = { state:true };

        /*const total = await Category.countDocuments( queryParams );
        const categories = await Category.find(queryParams).skip(offset).limit(limit)*/
        
        const [total,categories] = await Promise.all([
            Category.countDocuments( queryParams ),
            Category.find(queryParams)
            .populate({path:'user', select:'name email'})
            .skip(Number (offset))
            .limit(Number(limit))
        ])

        return res.status(200).json({
            total,
            categories
        })

    } catch (e) {
        console.error(e.message);
        return res.status(400).json({msg: e.message});   
    }

}

//obtener categoria -- populate {}
const getCategoryById = async (req, res = response)=> {
    
    try {
        const categoryId = req.params.id;
        const category = await Category.findById( { _id : categoryId } )
                                        .populate({path:'user', select:'name email'});
        return res.status(200).json({category});
    } catch (e) {
        console.error(e.message);
        return res.status(400).json({msg: e.message});
    }

}

const createCategory = async(req, res=response)=>{

    try {
        const {name,state} = req.body;
        const categoriaBD = await Category.findOne({name:name.toUpperCase()})
        //console.log({categoriaBD});
        if ( !categoriaBD ){
            //sacamos el usuario que viene del Request desde la función de Validación del token consultado a la BDs
            const userAuth = req.userAuth;
            const data = {
                name,
                state,
                user:userAuth._id
            }
            const category = new Category( data );
            await category.save();
            return res.status(201).json({
                msg:'Categoria Creada con Exito',
                category
            })

        } else {
            throw new Error(`categoria ${ categoriaBD.name } ya existe`)
        }
    } catch (e) {
        console.error(e.message);
        return res.status(400).json(
            {
                msg: e.message
            }
        );
    }

}

//actualizarCategoria
const updateCategory = async (req = request,res = response) => {

    try {
        const { name, state } = req.body;
        const { id } = req.params;
        const userAuth = req.userAuth;
        const data = {
            name,
            state,
            user:userAuth._id
        }
        // parametro new para que regurese el objeto ya modificado;
        const category = await Category.findByIdAndUpdate(id, data, {new:true});
        return res.status(200).json({msg:'Actualización de categoria satisfactoriamente',category});
    } catch (e) {
        console.error(e.message);
        return res.status(400).json({msg: e.message});
    }

}

//borrar categoria -- estado : false
const deleteCategory = async (req ,res = response) => {

    try {
        
        const { id } = req.params;
        let category = await Category.findById( { _id : id } );
        const userAuth = req.userAuth;

        if(!category.state){
            return res.status(400).json({
                msg:'Categoria ya se encuentra inactiva'
            })
        }

        category = await Category.findByIdAndUpdate( id , {state:false, user:userAuth._id}, {new:true} );
        return res.status(200).json({
            msg:'Se ha borrado la categoria satisfactoriamente',
            category
        });
    } catch (e) {
        console.error(e.message);
        return res.status(400).json({msg: e.message});
    }
}

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} 