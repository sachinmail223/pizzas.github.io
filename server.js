require('dotenv').config()
const express = require('express');
const app = express();
const ejs = require('ejs');
const expreeLayouts = require('express-ejs-layouts');
const path = require('path');

const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
const passport = require('passport')


// DATA BASE conection
mongoose.connect(process.env.MONGO_CONNECTION_URL, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database conected.....');
}).catch(err => {
    console.log('Conection failed....');
});

// session store
let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})

// session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: {maxAge: 1000*60*60*24}
}))  

//passport config
const passportInit = require('./app/config/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())



app.use(flash())
// assets
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Globel middleware
app.use((req, res, next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})
// set view engine
app.use(expreeLayouts);
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs');

require('./routes/web')(app);

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
})
