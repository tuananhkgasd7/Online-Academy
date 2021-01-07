const express = require('express');

const router = express.Router();

// router.get('/', function (req, res){
//     res.render('user/login', {layout: false});
// })

router.get('/register', function (req, res){
    res.render('user/register');
})

module.exports = router;