const express=require('express');

const router = express.Router();

const userauthenticate = require('../middleware/auth')

 const expenses = require('../controller/expenses');

 router.post('/addexpenses',userauthenticate.authenticate,expenses.addExpense);

 router.get('/details',userauthenticate.authenticate,expenses.getExpense);
 
router.get('/download', userauthenticate.authenticate,expenses.downloadExpenses)

 router.delete('/delete/:id',userauthenticate.authenticate,expenses.postDeleteExpense)

module.exports = router;

