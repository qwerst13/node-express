const express = require('express');
const path = require('path');
const csurf = require('csurf');
const connectFlash = require('connect-flash');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const errorHandler = require('./middleware/error');
const fileMiddleware = require('./middleware/file');

require('dotenv').config();

const homeRoute = require('./routes/home');
const addRoute = require('./routes/add');
const cartRoute = require('./routes/cart');
const coursesRoute = require('./routes/courses');
const ordersRoute = require('./routes/orders');
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');

const variablesMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: require('./utils/hbs-helpers'),
});

const store = new MongoStore({
  collection: 'sessions',
  uri: process.env.MONGODB_URI,
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'src');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(fileMiddleware.single('avatar'));

app.use(csurf());
app.use(connectFlash());
app.use(helmet());
app.use(compression());

app.use(variablesMiddleware);
app.use(userMiddleware);

app.use('/', homeRoute);
app.use('/courses', coursesRoute);
app.use('/add', addRoute);
app.use('/cart', cartRoute);
app.use('/orders', ordersRoute);
app.use('/auth', authRoute);
app.use('/profile', profileRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

(async function () {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log('index', e);
  }
})();
