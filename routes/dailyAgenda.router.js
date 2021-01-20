const express = require('express');
const router   = express.Router() 
const controler = require('../controlers/dailyAgenda.controler');
const validate = require('../validate/validation');

router.get('/:curentPage',validate.isLogin,validate.accounterOnlyPages,controler.dailyAgenda)
router.get('/',validate.isLogin,validate.accounterOnlyPages,controler.dailyAgenda)

//  Add Invoice
router.post('/AddInvoice',validate.isLogin,validate.accounterOnlyFunctions_API , controler.AddInvoice)

// Edite Invoice
router.post('/EditeInvoice',validate.isLogin,validate.accounterOnlyFunctions_API , controler.EditeInvoice)

// Delete Invoice
router.post('/DeleteInvoice',validate.isLogin,validate.accounterOnlyFunctions_API , controler.DeleteInvoice)


module.exports=router;