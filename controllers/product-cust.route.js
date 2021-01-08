const express = require('express');
const productModel = require('../models/product.model');
const { paginate } = require('../config/default.json');

const router = express.Router();

router.get('/byCat/:id', async function (req, res){
    const idCat = +req.params.id;

    for (c of res.locals.lcCategories) {
        if (c.catID === idCat){
            c.IsActive = true;
            break;
        }
    }

    const page = req.query.page || 1;
    if (page < 1) page = 1;

    const totalCourse = await productModel.countByCat(idCat);
    let nPages = Math.floor(totalCourse / paginate.limit);
    if (totalCourse % paginate.limit > 0) nPages++;

    const page_numb = [];
    var currentPage = 0;
    for (i = 1; i <= nPages; i++) {
        page_numb.push({
            value: i,
            isCurrentPage: i === +page
        });
        if ((i===+page)===true)
            currentPage = i;
    }

    const offset = (page - 1) * paginate.limit;

    const list = await productModel.pageByCat(idCat, offset);

    console.log(currentPage + 1);
    console.log(currentPage - 1);

    res.render('product/byCat', {
        products: list,
        page_numb,
        empty: list.length === 0,
        n: currentPage===nPages,
        p: currentPage===1,
        nextPage: currentPage + 1,
        prePage: currentPage - 1
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