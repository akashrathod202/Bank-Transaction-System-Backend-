require('dotenv').config({ path: './.env' });
const app=require('./src/app')
const connectdb=require('./src/config/db')


connectdb().then(()=>{
    app.listen(3000,()=>{
        console.log("server is runnung on the server 3000  🚀")
        })
})
 