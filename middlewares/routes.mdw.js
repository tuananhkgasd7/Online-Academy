const auth = require('./auth.mdw');
const productModel = require('../models/product.model');

module.exports = function (app) {
    app.get('/', async function (req, res) {
        const most_joined = await productModel.mostJoinedCourse();
        const most_joined_one = most_joined[0];
        most_joined.splice(0, 1);

        const latest = await productModel.latestCourse();
        const latest_one = latest[0];
        latest.splice(0, 1);

        const top = await productModel.topCourse();
        const top_one = top[0];
        top.splice(0, 1);
        res.render('home', {
            most_joined,
            most_joined_one,
            latest,
            latest_one,
            top,
            top_one
        })
    })

    app.use('/user/', require('../controllers/user.route'));
    app.use('/products/', require('../controllers/product-cust.route'));
    app.use('/cart/', auth, require('../controllers/cart.route'));
    app.use('/admin/categories/', require('../controllers/category.route'));
    app.use('/admin/products/', require('../controllers/product.route'));
}