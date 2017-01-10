var path        = require('path');
var express     = require('express');
var session     = require('express-session');
var MongoStore  = require('connect-mongo')(session);
var flash       = require('connect-flash');
var config      = require('config-lite');
var routes      = require('./routes');
var pkg         = require('./package');

var app         = express();

// template files
app.set('views', path.join(__dirname, 'views'));
// template engine
app.set('view engine', 'ejs');

// static file
app.use(express.static(path.join(__dirname, 'public')));

// session middleware
app.use(session({
    name: config.session.key,
    secret: config.session.secret,
    cookie: {
        maxAge: config.session.maxAge
    },
    store: new MongoStore({
        url: config.mongodb
    })
}));

app.use(flash());

// set template global constant
app.locals.blog = {
    title: pkg.name,
    description: pkg.description
};

app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});
// img uploead
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'),
  keepExtensions: true
}));

routes(app);

app.listen(config.port, function () {
    console.log(`${pkg.name} is listening on port ${config.port}`);
});
