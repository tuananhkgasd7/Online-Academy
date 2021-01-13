const express = require('express');
const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const auth = require('../middlewares/auth.mdw')

const router = express.Router();



router.get('/register', function (req, res) {
    res.render('user/register');
})

router.post('/register', async function (req, res) {
    const hash = bcrypt.hashSync(req.body.pwd, 10);
    const new_user = {
        userName: req.body.username,
        password: hash,
        fullName: req.body.name,
        dob: req.body.birth,
        gender: req.body.sex,
        phoneNumber: req.body.phone,
        email: req.body.username,
        address: req.body.location,
        permission: 0
    }
    console.log(new_user)
    await userModel.add(new_user);
    res.redirect('/user/login');
})

router.get('/is-available', async function(req, res)
{
    const username = req.query.user;
    const user = await userModel.singleByUserName(username);
    if(user ===null){
        return res.json(true);
    }

    res.json(false);
})

router.get('/login', function (req, res){
    res.render('user/login');
})

router.post('/login', async function (req, res)
{
    const user = await userModel.singleByUserName(req.body.username);
    if (user === null) {
        return res.render('user/login', {
            err_message: 'Email không hợp lệ.'
        });
    }

    const ret = bcrypt.compareSync(req.body.pwd, user.password);
    if (ret === false) {
        return res.render('user/login', {
            err_message: 'Mật khẩu không hợp lệ.'
        });
    }

    req.session.auth = true;
    req.session.authUser = user;


    const url = req.session.retUrl || '/';
    res.redirect(url);
})

router.get('/profile', auth, function (req, res) {
    res.render('user/profile');
})

router.post('/logout', function (req, res) {
    req.session.auth = false;
    req.session.authUser = null;
    req.session.retUrl = null;
    req.session.cart = [];
    console.log(req.session.auth);
    const url = req.headers.referer || '/';

    res.redirect(url);
})

module.exports = router;