const Role = require('../models/role'); 
const { Category, User, Product } = require('../models'); 

const isValidRole = async(role = '') => {
    
    //validar si el role existe en BDs
    const existsRole = await Role.findOne({ rol:role });
    if (!existsRole){
        throw new Error(`El rol ${role} no esta registrado en BDs`);
    }
}


const emailExists = async (email='') => {

    //verficar si correo existe
    const emailExists = await User.findOne( {email} );
    if ( emailExists ) {
        throw new Error( `El E-mail [${email}] ya se encuentra registrado` );
    }

}

/** validador de usuarios en BDs */
const userExistsById = async (id = '') => {

    //verficar si usuario existe
    const userExists = await User.findById( { _id : id } );// el obj _id es en la BD y en id viene el dato capturado
    //console.log({userExists})
    if ( !userExists ) {
        throw new Error( `El id de usuario [${id}] enviado no se encuentra registrado` );
    }

}

/** validador de categorias en BDs */
const categoryExistsById = async (id = '') => {

    //verficar si usuario existe
    if(id.length > 0){
        const categoryExists = await Category.findById( { _id : id } );// el obj _id es en la BD y en id viene el dato capturado
        if ( !categoryExists ) {
            throw new Error( `El id de categoria [${id}] enviado no se encuentra registrado` );
        }
    } else {
        throw new Error( `categoria [${id}] no puede ser vacia` );
    }
}

/** validador de product en BDs */
const productExistsById = async (id = '') => {

    //verficar si usuario existe
    const productExists = await Product.findById( { _id : id } );// el obj _id es en la BD y en id viene el dato capturado
    if ( !productExists ) {
        throw new Error( `El id de producto [${id}] enviado no se encuentra registrado` );
    }
}

const validCollection = (collection, validCollections)=>{

    const valid = validCollections.includes(collection);
    if (!valid){
        throw new Error( `La collección  [${collection}] no esta incluida en [${validCollections}]` );
    }
    return true;

}


module.exports = {
    isValidRole,
    emailExists,
    userExistsById,
    categoryExistsById,
    productExistsById,
    validCollection
}