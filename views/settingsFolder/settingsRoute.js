const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) =>{
    res.render('settings');
    next()
})


module.exports = router;