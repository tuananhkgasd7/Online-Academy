const express = require('express');

const categoryModel = require('../models/category.model');

const router = express.Router();

router.get('/', async function (req, res){
    const list = await categoryModel.all();
    res.render('category/view', {
        categories: list,
        empty: list.length === 0
    });
})

router.get('/add', function (req, res){
    res.render('category/add');
})

router.post('/add', async function (req, res){
    console.log(req.body);
    await categoryModel.add(req.body);
    res.redirect('/admin/categories');
})

router.post('/delete', async function (req, res){
    await categoryModel.del(req.body.catID);
    res.redirect('/admin/categories');
})

router.post('/update', async function (req, res){
    await categoryModel.update(req.body);
    res.redirect('/admin/categories');
})

router.get('/edit', async function (req, res){
    const id = req.query.id;
    const category = await categoryModel.single(id);

    if(category===null){
       return res.redirect('/admin/categories');
    }

    res.render('category/edit', {
        category
    });
})

module.exports = router;