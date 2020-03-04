const express= require('express')
require('./db/mongoose.js')
require('./middleware/auth')

const app= express()
const port= process.env.PORT


const userRouter= require('./router/user')
const taskRouter=require('./router/task')

/* app.use((req,res,next)=>{
   res.status(503).send('Service is not available') 
}) */



app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, ()=>{
    console.log('Server is set up on port '+port)
})

