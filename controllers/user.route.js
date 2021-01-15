const express = require('express');
const userModel = require('../models/user.model');
const categoryModel = require('../models/category.model')
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

    if (user.permission === 1) {
        user.IsTeacher = true;
    }
    else if (user.permission === 2) {
        user.IsAdmin = true;
    }


    req.session.auth = true;
    req.session.authUser = user;


    const url = req.session.retUrl || '/';
    res.redirect(url);
})

router.get('/forgetPass', function (req, res) {
    res.render('user/inputUserName');
})

router.post('/forgetPass', async function(req,res)
  {
    console.log(req.body);
    req.session.forget = await userModel.singleByUserName(req.body.username);

    res.redirect('/user/confirm');
  })
  
router.get('/confirm', async function(req, res)
{
    var code = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
        code += possible.charAt(Math.floor(Math.random() * possible.length));

    req.session.code = code;

    console.log('code: ' + req.session.code);
    res.render('user/confirmPhone', {
        phone: req.session.forget.phoneNumber
    })
})

router.post('/confirm',async function(req,res, next)
{
    console.log(req.body);
    console.log(req.session.code);
    if (req.session.code===req.body.code)
            res.redirect('/user/changePass');
    else
        res.render('user/confirmPhone')
})

router.get('/changePass', function(req,res)
{
    res.render('user/forgetPass')
}) 

router.post('/changePass', async function(req,res)
{
    const hash = bcrypt.hashSync(req.body.pwd, 10);  
    req.session.forget.password = hash;
    const entity = {
        userID: req.session.forget.userID,
        password: hash
    }
    await userModel.update(entity);
    res.redirect('/');

})


router.get('/profile/confirmPass', auth, function(req, res) {
    res.render('user/inputPass');
})

router.post('/profile/confirmPass', function(req,res)
{
    const ret = bcrypt.compareSync(req.body.oldpwd, req.session.authUser.password);
    if(ret===false){
        return res.render('user/inputPass', {
            err_message: 'Mật khẩu cũ không chính xác'
        });
    }
    else{
        res.redirect('/user/profile/changePass');
    }
})

  router.get('/profile/changePass', auth, function (req, res) {
      res.render('user/changePass');
  })

router.post('/profile/changePass', auth, async function (req, res) {
    const hash = bcrypt.hashSync(req.body.newpwd, 10);
    const new_pass = {
        userID: req.session.authUser.userID,
        password: hash
    }
    await userModel.update(new_pass);

    req.session.auth = false;
    req.session.authUser = null;
    req.session.retUrl = null;
    req.session.cart = [];
    res.redirect('/user/login');
})

router.get('/profile/confirmPassInfor', auth, function(req, res) {
    res.render('user/inputPass');
})

router.post('/profile/confirmPassInfor', function(req,res)
{
    const ret = bcrypt.compareSync(req.body.oldpwd, req.session.authUser.password);
    if(ret===false){
        return res.render('user/inputPass', {
            err_message: 'Mật khẩu cũ không chính xác'
        });
    }
    else{
        res.redirect('/user/profile/updateInfor');
    }
})

router.get('/profile/updateInfor', function(req, res) {
    res.render('user/updateInfor');
})

router.post('/profile/updateInfor', async function(req,res)
{
    console.log(req.body);  
    await userModel.update(req.body);
    const user = await userModel.singleByUserName(req.body.userName);
    console.log(user);
    req.session.authUser = user;
    res.locals.authUser=req.session.authUser;
    console.log(req.session.authUser);
    res.redirect('/user/profile');
}) 

router.get('/profile', auth, function (req, res) {
    res.render('user/profile');
})

router.get('/profile/registerTeacher', auth, function (req, res) {
    res.render('user/registerTeacher')
})

router.post('/profile/registerTeacher', auth, async function (req, res) {
    const hash = bcrypt.hashSync(req.body.pwd, 10);
    const new_teacher = {
        userName: req.body.username,
        password: hash,
        fullName: req.body.name,
        dob: req.body.birth,
        gender: req.body.sex,
        phoneNumber: req.body.phone,
        email: req.body.username,
        address: req.body.location,
        permission: 1
    }
    console.log(new_teacher)
    await userModel.add(new_teacher);
    res.redirect('/user/profile');
})

router.get('/profile/viewListStudent', async function (req, res) {
    const list = await userModel.getList(0);
    res.render('user/viewListStudent', {
        students: list,
        empty: list.length === 0
    })
})

router.get('/profile/viewListTeacher', async function (req, res) {
    const list = await userModel.getList(1);
    res.render('user/viewListTeacher', {
        teachers: list,
        empty: list.length === 0
    })
})

router.get('/profile/viewListCategory', async function (req, res) {
    const list = await categoryModel.all();
    res.render('user/viewListCategory', {
        categories: list,
        empty: list.length === 0
    });
})

router.get('/profile/addCat', function (req, res){
    res.render('user/addCat');
})

router.post('/profile/addCat', async function (req, res){
    await categoryModel.add(req.body);
    res.redirect('/user/profile/viewListCategory');
})

router.post('/profile/deleteCat', async function (req, res){
    await categoryModel.del(req.body.catID);
    res.redirect('/user/profile/viewListCategory');
})

router.post('/profile/updateCat', async function (req, res){
    await categoryModel.update(req.body);
    res.redirect('/user/profile/viewListCategory');
})

router.get('/profile/editCat', async function (req, res){
    const id = req.query.id;
    const category = await categoryModel.single(id);

    if(category===null){
       return res.redirect('/user/profile/viewListCategory');
    }

    res.render('user/editCat', {
        category
    });
})

router.get('/profile/view_course', auth, function (req, res) {
    res.render('user/view_course');
})

router.get('/profile/add_course', auth, function (req, res) {
    res.render('user/update_course')
})

router.post('/logout', function (req, res) {
    req.session.auth = false;
    req.session.authUser = null;
    req.session.retUrl = null;
    req.session.cart = [];
    // console.log(req.session.auth);
    const url = req.headers.referer || '/';

    res.redirect(url);
})

module.exports = router;