const express = require('express');

const productModel = require('../models/product.model')

const router = express.Router();

router.get('/byCat/:id', async function (req, res){
    const idCat = +req.params.id;

    for (c of res.locals.lcCategories) {
        if (c.catID === idCat){
            c.IsActive = true;
            break;
        }
    }

    const list = await productModel.allByCat(idCat);
    res.render('product/byCat', {
        products: list,
        empty: list.length === 0
    });
})

router.get('/detail/:id', async function (req, res){
    const idCourse = req.params.id;

    const product = await productModel.single(idCourse);

    if (product === null){
        return res.redirect('/product/byCat');
    }
    res.render('product/detail', {
        product
    });
})

module.exports = router;