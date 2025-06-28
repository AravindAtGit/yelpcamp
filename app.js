if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express=require("express");
const mongoose=require('mongoose');
const path=require('path');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user')


const session = require('express-session');


const MongoDBStore = require("connect-mongo")(session);


const flash = require('connect-flash');

const usersrouts= require('./routes/users');
const campgroundsroutes = require('./routes/campgrounds');
const reviewsroutes = require('./routes/reviews');
const dbUrl=process.env.DB_URL || 'mongodb://localhost:27017/yelpcamp';

mongoose.connect(dbUrl) 

const mo=require('method-override');
const { runInNewContext } = require("vm");
const { getMaxListeners } = require("events");

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("db connected")
});

const app=express();

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}));
app.use(mo('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())) //generates a method used in passport local strategy

passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

//how do we store details of user in session
 app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fake',async(req,res)=>{
    const user=new User({email:'garavind@getMaxListeners.com',username:'colt'})
    const newuser=await User.register(user,'chicken');
    res.send(newuser);
})

app.use('/', usersrouts)
app.use('/campgrounds', campgroundsroutes)
app.use('/',  reviewsroutes)

app.get('/',(req,res)=>{
    res.render('home')

})

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('page not found',404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000,()=>{
    console.log("listening at 3000");
})