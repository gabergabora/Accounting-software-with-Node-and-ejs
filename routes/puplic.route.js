const express = require('express');
const router   = express.Router() 
const controler = require('../controlers/puplic.controler');
const validate = require('../validate/validation');


router.get('/' ,validate.isLogin,controler.home)

router.get('/singup',validate.notAllowToLoginAgain ,controler.singup)
router.post('/singup' ,controler.singupUser)

router.post('/login' ,controler.loginUser)

router.get('/logout',controler.logout)



module.exports=router;