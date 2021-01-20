const express = require('express');
const router   = express.Router() 
const controler = require('../controlers/accounting_guide.controler');
const validate = require('../validate/validation');

router.get('/',validate.isLogin,validate.accounterOnlyPages,controler.accounting)


module.exports=router;