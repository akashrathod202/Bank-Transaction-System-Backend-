const mongoose=require('mongoose')
const bcrypt =require('bcryptjs')

const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:[true,"email is required for creating a user"],
        trim:true,
        lowercase:true,
        unique:[true,"Email is all ready exist"],
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
    
    },

     name:{
        type:String,
        required:[true,"Name is required for creating an account"],
    },

    password:{
        type:String,
        required:[true,"password is required for creating an account"],
        minlength:[8,"password should be contain more than 8 character"],
        select:false,
        trim:true
    }
},
{
    timestamps: true
  })



// this runs automatically before saving a user to db

userSchema.pre("save",async function (){
    if (!this.isModified("password")){
        return ;
    }

    const hash=await bcrypt.hash(this.password,10)
    this.password=hash
     
})



userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

const userModel=mongoose.model("user",userSchema)
module.exports=userModel  
