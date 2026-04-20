const mongoose=require("mongoose")

const transaction= new mongoose.Schema({

  
       fromAccount :{
           types:mongoose.Schema.Tyes.ObjectId,
           ref:"account",
           required:[true,"Transaction must be associated with a from a account"],
           index:true
       },

       toaccount:{
        types:mongoose.Schema.Tyes.ObjectId,
        ref:"account",
        required:[true,"Transaction must be associated with a to  a account"],
        index:true
       },

       status:{
       enum:{
        values:['PENDING',"COMPLETED","FAILED","REVERSED"]
       },
       default:"PENDING"
       },
     amount:{
        type:Number,
        required:[true,"Amount is required for creating a transaction"],
        min:[0,"Transaction amount cannot be negative"]
     },
     idempotencykey:{
        type:String,
        required:[true,"Idemotency key is required for creating a transaction"],
        indext:true,
        unique:true
     }

},{
    timestamps:true
})

const transactionModel=mongoose.model("transaction",transactionSchema)

module.exports=transactionModel