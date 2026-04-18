const userModel=require('../models/usermodel')
const jwt=require('jsonwebtoken')



async function userRegiserController(req,res){

    const {email,password,name}=req.body

    const exist= await userModel.findOne({email:email})
    if (exist){
       return res.status(422).json({
             message:"user already exists with eamil.",
             status:"falied"
       });
    }

    const user=await userModel.create({
        email,password,name 
    })

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
    
    res.cookie("token",token)
    
    res.status(201).json({
        user:{
            _id:user._id,
             email:user.email,
            name:user.name
        },
        token
    })
}

async function userLoginController(req,res){
    const  {email,password}=req.body

     

     
    if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
        return res.status(401).json({
            message: "email or password is invalid"
        });
    }

 
const isValidPassword=await user.comparePassword(password)


if(!isValidPassword){
    return res.status(401).json({
        message:"email or passeord is Invalid"
    })
}

 
const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
);

res.cookie("token",token)

res.status(200).json({
    message: "Login successfully",
    user:{
        _id:user._id,
         email:user.email,
        name:user.name
    },
    token
})
}
 
    
 
     


module.exports={
    userRegiserController,
    userLoginController
}