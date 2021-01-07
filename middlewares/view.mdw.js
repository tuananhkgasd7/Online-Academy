const numeral = require('numeral');
const exphbs = require('express-handlebars');

module.exports = function (app) {
    app.engine('hbs', exphbs({
        defaultLayout: 'main.hbs',
        helpers: {
          format_number(val) {
            return numeral(val).format('0,0');
          }
        }
      }));
    app.set('view engine', 'hbs');
}