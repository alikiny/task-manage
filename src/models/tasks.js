const mongoose= require('mongoose')
const validator= require('validator')

const taskSchema=new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    deadline:{
        type: String,
        default: new Date(),
        validate(value){
            const d= new Date(value)
            if(d=="Invalid Date") throw ('Invalid date')
            
        }
    },
    status:{
        type: Boolean,
        default: false
    }
},{
    timestamps:true
})

const Task= mongoose.model('Task',taskSchema)


module.exports =Task