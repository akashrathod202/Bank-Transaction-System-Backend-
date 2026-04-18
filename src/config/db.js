const mongoose=require('mongoose')

async function connectdb(){
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('database connected succesfully');
    }
    catch(err){
        console.log("Error connecting to DB ❌", err.message);
        process.exit(1);
    }
}

module.exports=connectdb;
