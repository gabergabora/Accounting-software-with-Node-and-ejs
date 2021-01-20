const express = require('express');
const router   = express.Router() 
const controler = require('../controlers/accounting_guide.controler');
const validate = require('../validate/validation');


router.get('/',validate.isLogin,validate.accounterOnlyPages,controler.Accounting_guide)


// add new accounting guide
router.post('/addAccounting_guide',validate.isLogin,validate.accounterOnlyFunctions_API,controler.AddAccounting_guide)
// edite accounting guide
router.post('/editeAccounting_guide',validate.isLogin,validate.accounterOnlyFunctions_API,controler.editeAccounting_guide)
// delete accounting guide
router.post('/deleteAccounting_guide',validate.isLogin,validate.accounterOnlyFunctions_API,controler.deleteAccounting_guide)


module.exports=router;