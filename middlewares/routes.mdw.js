const auth = require('./auth.mdw');

module.exports = function (app) {
    app.get('/', function (req, res) {
        // console.log(req.session.auth);
        // console.log(req.session.authUser);
        res.render('home')
    })

    app.get('/login', function (req, res) {
        res.render('user/login', {layout: false});
    });

    app.get('/register', function (req, res) {
        res.render('user/register', {layout: false});
    })

    app.use('/user/', require('../controllers/user.route'));
    app.use('/products/', require('../controllers/product-cust.route'));
    app.use('/cart/', auth, require('../controllers/cart.route'));
    app.use('/admin/categories/', require('../controllers/category.route'));
    app.use('/admin/products/', require('../controllers/product.route'));
}