const express=require('express');
const { Router } = require('react-router-dom');
const router=express.Router();
const {body}=require("express-validator")
const userController=require('../controllers/user.Controller')
router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('Firstname must be 3 chacter long'),
    body('password').isLength({min:5}).withMessage('Password must be 5 chacter long')
],
userController.registerUser
)


module.exports=router