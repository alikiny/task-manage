const mongoose= require('mongoose')
const validator= require('validator')
const bcrypt=require('bcryptjs')
const jwt= require('jsonwebtoken')
const Task= require('./tasks')
const sharp= require('sharp')


const userScheme= new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique:true,
            trim: true
        },
        email:{
            type: String,
            
            required: true,
            unique:true,
            trim: true,
            lowercase: true,
            validate(value){
                if(validator.isEmail(value)!=true){
                    throw 'Invalid email address'
                }
            }
        },
        age: {
            type: Number,
            required: true,
            validate(value){
                if (value <=0) throw 'Invalid number'
                if (value>0 && value<18) throw new Error('You must be over 18 to use the service')
                
            }
        },
        career:{
            type: String,
            uppercase: true,
            default: 'Unknown'
        },
        password:{
            type:String,
            required: true,
            trim:true,
            validate(value){
                if(value.length<6 || value.lenth>15) throw 'Length should be between 6 and 15 characters'
                if(validator.isAlpha(value)) throw 'Your password only contain letters. Enter number and special character'
                if(validator.isAlphanumeric(value)) throw 'Please add special character to your password'
            }
        },
        avatar:{
            type: Buffer
        },
        tokens:[{
            token:{
                type:String,
                required:true
            }
        }]
    },{
        timestamps:true
    })

userScheme.virtual('tasks',{
    ref:'Task',
    localField: '_id',
    foreignField:'owner'
})
 
userScheme.methods.toJSON=function(){
    const user=this
    const profile=user.toObject()
   
    delete profile.password
    delete profile.tokens
    delete profile.avatar

    // const profile={Name: user.name, Email: user.email, Age: user.age}
    return profile
}

userScheme.methods.generateAuthToken= async function(){
    const user=this
    const token= jwt.sign({_id: user._id.toString()},process.env.TOKEN)
    
    user.tokens=user.tokens.concat({token})
    await user.save()

    return token
}

 userScheme.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

//cannot use arrow function ()=>{} in middleware
userScheme.pre('save', async function(next){
    const user=this

    console.log('Save user')

    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }

    next()
})

//Remove tasks when delete user
userScheme.pre('remove',async function(next){
    const user=this
    await Task.deleteMany({owner: user._id})
    next()
})

//


const User= mongoose.model('User',userScheme)


module.exports = User