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
app.use('/media', express.static(path.join(__dirname, '/images')));
// app.set("/views/items", static(path.join(__dirname, 'views', 'items')));

//Router 설정
var mainRouter = require('./router/router');

app.use(mainRouter);

app.listen(3000, function() {
    console.log('MindHub Main Page Connected');
});