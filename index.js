const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const homeRoute = require('./routes/home');
const addRoute = require('./routes/add');
const cartRoute = require('./routes/cart');
const coursesRoute = require('./routes/courses');
const notFoundRoute = require('./routes/404');

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'src');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use('/', homeRoute);
app.use('/courses', coursesRoute);
app.use('/add', addRoute);
app.use('/cart', cartRoute);
app.use('/404', notFoundRoute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})