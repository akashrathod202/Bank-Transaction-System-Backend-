const express=require('express')
const authmiddleware=require('../middleware/auth.middleware')


const transactionRoutes=Router();

transactionRoutes.post('/',authmiddleware)


module.exports=transactionRoutes
