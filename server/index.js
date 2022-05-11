//  server creation step
// import express
const express=require('express')
// create server app using express
const dataservice=require('./service/dataservice')

const jwt=require('jsonwebtoken')
const cors=require('cors')
const app=express()
app.use(cors({
    origin:'http://localhost:4200'
}))
app.use(express.json())
// resolving api call
// GET- to read data 
app.get('/',(req,res)=>{
    res.send("GET REQUEST")
})
// post-to create data
app.post('/',(req,res)=>{
    res.send("post REQUEST")
})
// put-to update/modify
app.put('/',(req,res)=>{
    res.send("put REQUEST")
})
// put-to partially update/modify
app.patch('/',(req,res)=>{
    res.send("patch REQUEST")
})
// delete-to delete data
app.delete('/',(req,res)=>{
    res.send("delete REQUEST")
})
const jwtMiddleware=(req,res,next)=>{
try {
   const token=req.headers["token"]
   console.log(jwt.verify(token,'secret280501'));
  const data=jwt.verify(token,'secret280501')
  req.currentAcno=data.currentAcno
   next()     
 }
 catch{
     res.status(401).json({
         status:false,
         message:"please login"
     })
 }
}
    

app.post('/register',(req,res)=>{
    dataservice.register(req.body.name,req.body.acno,req.body.password)
   .then(result=>{
    res.status(result.statusCode).json(result)
   })
  
})
app.post('/login',(req,res)=>{
     dataservice.login(req.body.acno,req.body.pswd)
     .then(result=>{
        res.status(result.statusCode).json(result)
     })
   
 })
 app.post('/deposit',jwtMiddleware,(req,res)=>{
     dataservice.deposit(req.body.acno,req.body.pswd,req.body.amt)
     .then(result=>{
        res.status(result.statusCode).json(result)

     })
 })
 app.post('/withdraw',jwtMiddleware,(req,res)=>{
     dataservice.withdraw(req,req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)

     })
 })
 app.post('/transaction',jwtMiddleware,(req,res)=>{
dataservice.transaction(req.body.acno)
.then(result=>{
    res.status(result.statusCode).json(result)

 }) })
 app.delete('/onDelete/:acno',jwtMiddleware,(req,res)=>{
    dataservice.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    
     }) })
     

// set port number

app.listen(3000,()=>{
    console.log("server start at 3000 ");
})

