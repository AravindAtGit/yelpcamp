const express=require('express');
const router=express.Router(); 
const User=require('../models/user');
const catchAsync=require('../utils/catchAsync.js');
const passport=require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');

// router.get('/register',users.renderRegister)

// router.post('/register', catchAsync(users.register));

// router.get('/login', users.renderLogin)

// router.post('/login',  storeReturnTo,
//      passport.authenticate('local', {
//          failureFlash: true,
//          failureRedirect: '/login' }),users.login )

// router.get('/logout',users.logout ); 

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)
 

module.exports=router;