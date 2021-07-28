const { request, response,  } = require('express');

const getUser = (req = request, res = response) => {

    const {q,uuid,limit = 100, page = 1, option = {}} = req.query;
    res.json({
        msg:'get API from controller users',
        q,
        uuid,
        limit,
        page,
        option
    });
}

const postUser = (req, res = response) => {

    const {nombre,edad} =req.body;

    res.status(200).json({
        msg:'respose post from postUser.controller',
        nombre,
        edad
    });
}

const putUser = (req, res) => {

    const id = req.params.id;

    res.json({
        msg:'put API controller users',
        id,
    });
}

const deleteUser = (req, res) => {
    res.json({
        msg:'delete API controller users'
    });
}

const patchUser = (req, res) => {
    res.json({
        msg:'patch API controller users'
    });
}



module.exports = {
    getUser,
    postUser,
    putUser,
    deleteUser,
    patchUser
}