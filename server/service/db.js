// database connection
// import mongose
const mongoose=require('mongoose')
mongoose.connect("mongodb://localhost:27017/bankServer",{
    useNewUrlParser:true
})
//creat model
const User=mongoose.model('User',{
    acno:Number,
     name:String,
      password:String,
       balance:Number,
        transaction: []
})
module.exports={
    User
}