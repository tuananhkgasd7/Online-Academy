const express = require('express');
const productModel = require('../models/product.model');
const ratingModel = require('../models/rating.model');
const moment = require('moment');
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
    // console.log(page)

    const totalCourse = await productModel.countByCat(idCat);
    let nPages = Math.floor(totalCourse / paginate.limit);
    // console.log(totalCourse);
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
    // console.log(page_numb)

    const offset = (page - 1) * paginate.limit;

    const list = await productModel.pageByCat(idCat, offset);

    // console.log(offset);
    

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

    const most_buy = await productModel.mostBuyCourse(product.catID);

    const numRating = await ratingModel.getNumRating(idCourse);

    const rating = await ratingModel.getRating(idCourse);

    const star_1 = await ratingModel.getNumRating_Star(1, idCourse);
    const star_2 = await ratingModel.getNumRating_Star(2, idCourse);
    const star_3 = await ratingModel.getNumRating_Star(3, idCourse);
    const star_4 = await ratingModel.getNumRating_Star(4, idCourse);
    const star_5 = await ratingModel.getNumRating_Star(5, idCourse);

    const user_comments = await ratingModel.getUserComment(idCourse);
    console.log(user_comments);

    const rateOfCourse = {
        numRating,
        rating,
        user_comments,
        star_1,
        star_2,
        star_3,
        star_4,
        star_5,
    }

    console.log(rateOfCourse)

    // if (rating !== product.rating) {
    //     const course_rate = {
    //         courseID: idCourse,
    //         numRating,
    //         rating
    //     }
    
    //     await productModel.update(course_rate);
    // }

    const course_rate = {
        courseID: idCourse,
        numRating,
        rating
    }

    await productModel.update(course_rate);

    const teacher = await productModel.getTeacher(idCourse);

    if (product === null){
        return res.redirect('/product/byCat');
    }
    res.render('product/detail', {
        product,
        teacher,
        most_buy,
        rateOfCourse
    });
})

router.post('/detail/:id', async function (req, res) {
    const idCourse = req.params.id;

    const new_comment = {
        dateComment: moment().format('YYYY-MM-DD HH:mm:ss'),
        courseID: idCourse,
        userID: req.session.authUser.userID,
        rate: req.body.rate,
        comment: req.body.comment
    }
    console.log(new_comment);
    await ratingModel.add(new_comment);
    res.redirect(req.headers.referer);
})

router.get('/search', async function(req, res) {
    const page = req.query.page || 1;
    console.log(page)
    if (page < 1) page = 1;

    const offset = (page - 1) * paginate.limit;
    console.log(offset)

    const find = req.query.search;

    const list = await productModel.search(find, offset);


    const totalCourse = await productModel.countBySearch(find);
    console.log(totalCourse)
    let nPages = Math.floor(totalCourse / paginate.limit);
    if (totalCourse % paginate.limit > 0) nPages++;

    const page_numb = [];
    var currentPage = 0;
    for (i = 1; i <= nPages; i++) {
        page_numb.push({
            value: i,
            isCurrentPage: i === +page,
            find
        });
        if ((i===+page)===true)
            currentPage = i;
    }
    console.log(page_numb);


    // console.log(list.length);
    res.render('product/search', {
        products: list,
        empty: list.length === 0,
        page_numb,
        find,
        n: currentPage===nPages,
        p: currentPage===1,
        nextPage: currentPage + 1,
        prePage: currentPage - 1
    });
})

module.exports = router;