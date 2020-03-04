const express= require('express')
const Task= require('../models/tasks')
const taskRouter=new express.Router()
const auth = require('../middleware/auth')
const moongose=require('mongoose')
//Add new task
taskRouter.post('/tasks', auth,async(req,res)=>{
    const task= new Task(req.body)

    try{
        task.deadline= await new Date(task.deadline)
        task.owner=req.user._id
        await task.save()
        res.status(205).send(task)
       
        
    }catch(e){
        res.status(400).send(e)
    }
})

//fetch all the tasks
taskRouter.get('/tasks', auth,async(req,res)=>{
    const match={}
    const sort={}
    if(req.query.status){
        match.status= req.query.status==="true"}

    if(req.query.sort){
        const part=req.query.sort.split(':')
        if(part[1]==='desc'){
            sort[part[0]]=1
        }else if(part[1]==='asc'){
            sort[part[0]]=-1
        }else{
            res.status(400).send('Not recognize symbol')
        }
      //  sort[part[0]]=part[1]==='desc'?-1:1
    }
    
    try{
        await req.user.populate({
            path: "tasks",
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send()
    }
   
})

//Find task by id

taskRouter.get('/tasks/:id',auth, async(req,res)=>{
    const taskID=req.params.id

    try{
        if (!taskID.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(406).send('Invalid id')
        }

        const task=await Task.find({
            owner:req.user._id,
            _id: moongose.Types.ObjectId(taskID)
        })
        if(task){
            return res.status(201).send(task)
        }
        return res.status(404).send('Task not found')

    }catch(e){
        res.send(e)
    }
})



//Update tasks' information by ID
taskRouter.patch('/tasks/:id',auth,async(req,res)=>{
    const id=req.params.id
    const allowedUpdates= ["deadline","status","name"]
    const updates=Object.keys(req.body)
    const isValid= updates.every((param)=>{
        return allowedUpdates.includes(param)
    })

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(406).send('Invalid id')
    }

    if(!isValid){
        return res.status(406).send('Invalid update param')
    }

    try{
        const task= await Task.findOneAndUpdate({
            owner:req.user._id,
            _id: moongose.Types.ObjectId(id)
        },req.body,{
            new:true,
            runValidators: true
        }) 
        if(!task){
            return res.status(404).send('Task not found')
        }
        return res.send(task)
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
})





taskRouter.delete('/tasks/:id',auth,async(req,res)=>{
    const id=req.params.id
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(406).send('Invalid id')
    }
    try{
        const task= await Task.findOneAndDelete({
            owner:req.user._id,
            _id:id
        })
        if(!task){
            return res.status(404).send('No task found')
        }

        res.send(task)
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }

})

module.exports=taskRouter