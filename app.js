const express = require('express');
const morgan = require('morgan');


require('express-async-errors');

const app = express();

app.use(morgan('dev'));
app.use('/Front-end', express.static('Front-end'));

app.use(express.urlencoded({
  extended: true
}));


require('./middlewares/view.mdw')(app);
require('./middlewares/locals.mdw')(app);
require('./middlewares/routes.mdw')(app);

app.use(function(err, req, res, next){
  console.error(err.stack)
  res.render('500',{layout: false});
})


const PORT = 3000
app.listen(PORT, function () {
  console.log(`Online Academy app is listening at http://localhost:${PORT}`)
})