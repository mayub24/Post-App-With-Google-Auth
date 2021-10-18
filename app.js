const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const path = require('path');
const passport = require('passport');
// Express sessions
const session = require('express-session');
// mongostore to store session inside mongo
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');

const { formatDate, removeTags, editIcon, select, addButtons } = require('./helpers/hbs');

// Getting routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

// Import handlebars
const exphbs = require('express-handlebars');

// telling dotenv about safe.env
dotenv.config({ path: './config/safe.env' });

const app = express();

// bodyParser middleware
app.use(express.urlencoded({ extended: false }));

// Method override with express
// This allows us to put type of method in the path
// and the form performs that method
app.use(methodOverride('_method'));

// Passport config
// this is linked to the passport variable in passport.js
require('./config/passport')(passport);

// session middleware must be above passport middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ // store allows our session to be saved inside mongo
        mongoUrl: process.env.MONGO_URI
    })
}))

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global variable
app.use((req, res, next) => {
    res.locals.user = req.user || null;

    next();
})

// connect to database
connectDB();


// Connect handlebars as template engine
app.engine('.hbs',
    exphbs({
        helpers: { formatDate, removeTags, editIcon, select, addButtons }, // once we put helper functions in here, we can use them in our template files
        defaultLayout: 'main', extname: '.hbs'
    }));

app.set('view engine', '.hbs');

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Connecting routes to their files
app.use('/', index);
app.use('/auth/google', auth);
app.use('/stories', stories);


// morgan console logs the type of request being made
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Running in ${process.env.NODE_ENV} mode on PORT ${PORT}...`);
})