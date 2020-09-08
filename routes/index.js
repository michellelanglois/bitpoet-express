var express = require('express');
var router = express.Router();

var input_controller = require('../controllers/inputController');
var poem_controller = require('../controllers/poemController');

// GET for homepage
router.get('/', input_controller.user_input_get);

// POST for homepage
router.post('/', input_controller.user_input_post);

// GET for poem error
router.get('/poem/:type/error', poem_controller.poem_error);

// GET for poem
router.get('/poem/:type/:id', poem_controller.make_poem);

// POST for poem
router.post('/poem/:type/:id', poem_controller.make_poem_again);

module.exports = router;
