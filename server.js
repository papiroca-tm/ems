/**
 * Module dependencies.
 */
const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan'); // логер
const chalk = require('chalk'); // для консоли
const errorHandler = require('errorhandler'); // обработчик ошибок
const dotenv = require('dotenv'); // переменные окружения
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const expressStatusMonitor = require('express-status-monitor'); // статус монитор
const needle = require('needle');
const tress = require('tress');
const cheerio = require('cheerio');

const baseURL = 'https://www.content-review.com';
const newsURL = `${baseURL}/articles/news/`;
let results = [];
// `tress` последовательно вызывает наш обработчик для каждой ссылки в очереди
let q = tress(function (url, callback) {
  //тут мы обрабатываем страницу с адресом url
  needle.get(url, function (err, res) {
    if (err) {
      console.log('ошибка', err)
      return;
      // callback();
      // throw err;  // todo dont stop app
    }
    const $ = cheerio.load(res.body);
    let paginatorLastHref = $('.pagination').slice(0, 1).children().last().find('a').attr('href');
    if (paginatorLastHref !== '#') {
      const nextURL = `${newsURL}${paginatorLastHref}`;
      // console.log(nextURL)
      q.push(nextURL);
    }
    const articlesArr = $('.fp-article');
    articlesArr.each(async function (i, elem) {
      const div = $(this).find('div');
      const href = div.find('a').attr('href');
      const article = href.split('/')[2];
      const result = await articleExist(article)
      if (!result) {
        const title = div.find('h2').text();
        const dtText = div.find('time').attr('datetime');
        const datetime = new Date(dtText);
        const pText = $(this).find('p').text();
        const html = await getArticleHTML(href);
        let obj = {
          article: article,
          title: title,
          href: href,
          datetime: datetime,
          pText: pText,
          html: html
        }
        // results.push(obj);
        var articleDoc = new Article(obj);
        articleDoc.save(function (err, fluffy) {
          if (err) return console.error(err);
          console.log(`${url} - ${article} - saved`)
        });
      } else {
        console.log(`${url} - ${article} -  skiped`)
      }
    });
    // console.log(results.length)
    callback(); //вызываем callback в конце
  });
});
function getArticleHTML(href) {
  const url = `${baseURL}${href}`;
  return new Promise(function (resolve, reject) {
    needle.get(url, function (err, res) {
      if (!err && res.statusCode == 200) {
        const $ = cheerio.load(res.body);
        const html = $('.content.clearfix').html();
        resolve(html);
      } else {
        console.log('ошибка', err)
        reject('');
      }
    })
  });
}
async function articleExist(article) {
  try {
    let result = await Article.findOne({ article: article });
    return result;
  } catch (err) {
    console.error(err);
    return false;
  }
}
var articleSchema = mongoose.Schema({
  article: Number,
  title: String,
  href: String,
  datetime: Date,
  pText: String,
  html: String
});
var Article = mongoose.model('Article', articleSchema);
// // эта функция выполнится, когда в очереди закончатся ссылки
// q.drain = function () {
//   fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));
// }
// добавляем в очередь ссылку на первую страницу списка
// q.push(newsURL); // todo




/**
 * Load environment constiables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.conf' });

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.use(expressStatusMonitor());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true,
    clear_interval: 3600
  })
}));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

/**
 * Controllers (route handlers).
 */

const homeController = require('./server/controllers/home');
// const apiController = require('./server/controllers/api');

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
// app.get('/api', apiController.getApi);
// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
