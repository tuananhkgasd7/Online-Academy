const numeral = require('numeral');
const dayjs = require('dayjs');
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');

module.exports = function (app) {
    app.engine('hbs', exphbs({
        defaultLayout: 'main.hbs',
        helpers: {
          section: hbs_sections(),
          format_number(val) {
            return numeral(val).format('0,0');
          },
          format_time(val) {
            return dayjs(val).format('DD/MM/YYYY HH:mm:ss')
          }
        }
      }));
    app.set('view engine', 'hbs');
}