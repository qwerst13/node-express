const express = require('express');
const path = require('path');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const homeRoute = require('./routes/home');
const addRoute = require('./routes/add');
const cartRoute = require('./routes/cart');
const coursesRoute = require('./routes/courses');
const notFoundRoute = require('./routes/404');

require('dotenv').config();

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
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

(async function() {
    const user = process.env.USER;
    const password = process.env.PASSWORD;

    const url = `mongodb+srv://${user}:${password}@freecluster.mbgfb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
        });
    } catch (e) {
        console.log('index', e);
    }
})();


