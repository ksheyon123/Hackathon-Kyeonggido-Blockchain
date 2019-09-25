var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var static = require('serve-static');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Views template html -> ejs 설정
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set("/views", static(path.join(__dirname, 'views')));

app.use('/PGJ/media', express.static(path.join(__dirname, '/PGJ/images')));
app.use('/PGJ/images', express.static(path.join(__dirname, '/PGJ/images')));
app.use('/PGJ/css', express.static(path.join(__dirname, '/PGJ/css')));
app.use('/PGJ/fonts', express.static(path.join(__dirname, '/PGJ/fonts')));
app.use('/PGJ/js', express.static(path.join(__dirname, '/PGJ/js')));
app.use('/PGJ/vendor', express.static(path.join(__dirname, '/PGJ/vendor')));

app.use('/ohj/media', express.static(path.join(__dirname, '/ohj/images')));
app.use('/ohj/images', express.static(path.join(__dirname, '/ohj/images')));
app.use('/ohj/css', express.static(path.join(__dirname, '/ohj/css')));
app.use('/ohj/fonts', express.static(path.join(__dirname, '/ohj/fonts')));
app.use('/ohj/js', express.static(path.join(__dirname, '/ohj/js')));
app.use('/ohj/vendor', express.static(path.join(__dirname, '/ohj/vendor')));
//Router 설정
var mainRouter = require('./router/router');

app.use(mainRouter);

app.listen(3000, function() {
    console.log('MindHub Main Page Connected');
});