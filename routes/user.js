const { Router } = require('express');
const { getUser,
        postUser,
        putUser,
        deleteUser,
        patchUser } = require('../controllers/user.controller');

const router = Router();

router.get('/', getUser);

router.post('/', postUser);

router.put('/:id', putUser);

router.delete('/', deleteUser);

router.patch('/', patchUser);

module.exports = router;