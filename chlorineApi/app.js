var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Controladores Tradicionales..
var userController = require('./routes/Controllers/userController');
var productController = require('./routes/Controllers/productController');

// Controladores de administrador..
var clientController = require('./routes/Controllers Admin/clientAdminController');
var productAdminController = require('./routes/Controllers Admin/productAdminController');
var userAdminController = require('./routes/Controllers Admin/userAdminController');
var soldAdminController = require('./routes/Controllers Admin/soldAdminController')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine( 'html', require('ejs').renderFile );

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({origin: true}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Direcciones para tienda...
app.use( '/api/v1/tienda/user', userController );
app.use( '/api/v1/tienda/product', productController );

// Direcciones para panel..
app.use( '/api/v1/panel/cliente', clientController );
app.use( '/api/v1/panel/product', productAdminController );
app.use( '/api/v1/panel/user', userAdminController );
app.use( '/api/v1/panel/sold', soldAdminController );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
