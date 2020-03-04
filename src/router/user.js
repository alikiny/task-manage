const express=require('express')
const router =new express.Router()
const User=require('../models/users')
const auth= require('../middleware/auth')
const upload=require('../middleware/upload')
const sendEmail=require('../email/sendEmail')

router.post('/users',async (req,res)=>{
    
    const user= new User(req.body)

    try{
        await user.save()
        const token= await user.generateAuthToken()
        const email= req.body.email
        const subject="Welcome to thenycode"
        const text="Dear "+req.body.name
        const html='<p>We are glad that you choose us for your journey</p>'
        sendEmail(email,subject,text,html)
        res.status(201).send({user,token})
        
    }catch(e){
        res.status(400).send(e)
    }
    
})

router.post('/users/avatar',auth,upload.single('upload'),async(req,res)=>{
    req.user.avatar=req.file.buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.get('/users/profile',auth,async(req,res)=>{

    res.send(req.user)
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.get('/users/avatar',auth,async(req,res)=>{

    // const id=req.params.id
    // try{
    //     const user=await User.findById(id)
    //     if(!user || !user.avatar){
    //         throw new Error('No avatar avaliable')
    //     }
    //      res.set('Content-Type','image/jpg')
    //     res.send(user.avatar)
    // }catch(e){
    //     console.log(e.message)
    //     res.status(404).send()
    // }
    try{
        res.send(req.user)
        // res.set('Content-Type','image/jpg')
        // res.send(req.user.avatar)
    }catch(e){
        res.status(500).send()
    }
    
})


router.patch('/users/profile',auth,async(req,res)=>{
    // const id= req.params.id

    const updates=Object.keys(req.body)
    const allowedUpdates=['name','age','email','password','career']
    const isValid= updates.every((checkedParam)=>{
        return allowedUpdates.includes(checkedParam)
    })

    //Check if the update is available(if the parameter exists)
    if(!isValid){
        return res.status(406).send('Check all the parameters')
    }

    //Check if the entered 'id' a valid id
    try{
        /* if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(406).send('Invalid id')
        } */

        

        updates.forEach((update)=>
            req.user[update]=req.body[update]
            
        )
        await req.user.save()
        
        /* const user=await User.findByIdAndUpdate(id,req.body,{
            new: true,
            runValidators:true
        }) */
        
           
        return res.status(201).send(req.user)
       
    }catch(e){
        return res.status(500).send(e)
    }
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/profile',auth,async(req,res)=>{
    // const id=req.params.id
    // if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    //     return res.status(406).send('Invalid id')
    // }
    try{
        const email= req.user.email
        const subject="Say Goodbye for now..."
        const text="Dear "+req.user.name
        const html='<p>We wish you best luck in your next journey and hopefully we can get back soon</p>'
        sendEmail(email,subject,text,html)

        await req.user.remove()

        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
    

},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/avatar/delete',auth,async(req,res)=>{
    try{
        req.user.avatar=undefined
        await req.user.save()
        res.send()
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})

router.post('/users/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token=await user.generateAuthToken()
        res.status(200).send({user,token})
    }catch(e){
       
        console.log(e)
        res.status(400).send('Unable to login')
        
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        
        await req.user.save()
        res.send()
    }catch(e){
        console.log(e)
        res.status(500).send(e)

    }
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[]

        await req.user.save()
        res.send('Logged out')
    }catch(e){
        
        res.status(500).send('Cannot log out')
    }
})
module.exports=router