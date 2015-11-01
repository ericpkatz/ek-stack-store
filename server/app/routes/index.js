'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/members', require('./members'));
router.use('/products', require('./products'));
router.use('/line_items', require('./line_items'));
router.use('/cart', require('./cart'));
router.use('/orders', require('./orders'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
