const router = require('express').Router();
const controller = require('../controllers/reportController');

router.get('/summary', controller.summary);

module.exports = router;
