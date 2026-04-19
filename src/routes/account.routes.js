const express=require("express")
const  authmiddleware=require('../middleware/auth.middleware')
const createAccountController=require('../controllers/account.controller')
const accountRouter=express.Router()


accountRouter.post('/',authmiddleware,createAccountController)

module.exports=accountRouter