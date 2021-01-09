const express = require('express');
const user_models = require('../models/user.model');
const router = express.Router();


router.get('/register', function (req, res, next){
    res.render('user/register');
})

router.post('/register', async function (req, res, next)
{
    //console.log(req.body);
    const hash = bcrypt.hashSync(req.body.pwd, 10);
    //const dob = monent(req.body.birth,'DD/MM/YYYY').format('YYYY-MM-DD');
    // console.log(hash);
    //console.log(dob);
    const new_user = {
        userName: req.body.username,
        password: hash,
        fullName: req.body.name,
        dob: req.body.birth,
        gender: req.body.sex,
        phoneNumber: req.body.phone,
        email: req.body.username,
        address: req.body.location
    }
    console.log(new_user)
    await user_models.add(new_user);
    //res.render('user/signup')
    res.redirect('/user/login');
})

router.get('/is-available', async function(req,res)
{
    const username = req.query.user;
    const user = await user_models.singleByUserName(username);
    if(user ===null){
        return res.json(true);
    }

    res.json(false);
})

router.get('/login', function (req, res, next){
    res.render('user/login');
})

router.post('/login', async function (req, res, next)
{
    
})

module.exports = router;