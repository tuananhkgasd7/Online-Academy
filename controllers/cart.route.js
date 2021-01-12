const express = require('express');
const cartModel = require('../models/cart.model');
const productModel = require('../models/product.model');
const orderModel = require('../models/order.model');
const detailModel = require('../models/detail.model');
const moment = require('moment');

const router = express.Router();

router.get('/', async function (req, res) {
    const items = [];
    let temp = 0;
    for (const ci of req.session.cart) {
        const product = await productModel.single(ci.id);
        const teacher = await productModel.getTeacher(ci.id);
        items.push({
            product,
            teacher,
            quantity: ci.quantity,
            price: product.coursePrice * ci.quantity
        })
        temp += product.coursePrice * ci.quantity;
    }

    res.render('cart/view', { 
        items,
        temp, 
        empty: items.length === 0 
    });
}) 

router.post('/add', async function (req, res) {
    console.log(req.body.id);
    const item = {
        id: req.body.id,
        quantity: 1,
    }

    cartModel.add(req.session.cart, item);
    res.redirect(req.headers.referer);
})

router.post('/remove', async function (req, res) {
    cartModel.remove(req.session.cart, req.body.id);
    res.redirect(req.headers.referer);
})

router.get('/payment', async function(req, res) {
    const items = [];
    let temp = 0;
    for (const ci of req.session.cart) {
        const product = await productModel.single(ci.id);
        const teacher = await productModel.getTeacher(ci.id);
        items.push({
            product,
            teacher,
            quantity: ci.quantity,
            price: product.coursePrice * ci.quantity
        })
        temp += product.coursePrice * ci.quantity;
    }

    res.render('cart/payment', {
        items,
        temp, 
        empty: items.length === 0 
    });
})

router.post('/checkout', async function (req, res) {
    let total = 0;

    const details = []
    for (const ci of req.session.cart) {
        const product = await productModel.single(ci.id);
        const amount = await product.coursePrice * ci.quantity;
        total += amount;
        details.push({
            orderID: -1,
            courseID: product.courseID,
            quantity: ci.quantity,
            price: product.coursePrice,
            amount: total
        });
    }

    const order = {
        orderDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        userID: req.session.authUser.userID,
        totalPrice: total,
        name: req.session.authUser.fullName,
        email: req.session.authUser.email,
        phone: req.session.authUser.phoneNumber,
        address: req.session.authUser.address
    }

    const rs = await orderModel.add(order);

    for (const detail of details) {
        detail.orderID = rs.insertId;
        await detailModel.add(detail);
    }

    req.session.cart = [];
    res.redirect(req.headers.referer);
})

module.exports = router;