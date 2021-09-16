const { Router } = require('express');
const { searchItems } = require('../controllers/search.controller')

const router = Router();

router.get('/:collection/:term',[],searchItems);

module.exports = router;