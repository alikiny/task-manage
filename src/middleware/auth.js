const jwt=require('jsonwebtoken')
const User=require('../models/users')

const auth= async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded= jwt.verify(token,process.env.TOKEN)
        const user=await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })

        if(!user){
            throw new Error('Cannot identify user')
        }

        req.user=user // store user info in a new param req.user
        req.token=token //store user token in a new param req.token
        console.log(user)
        
        next()
    }catch(e){
        console.log(e)
        res.status(401).send({
            error:"Invalid token. Authentication is required"
        })
    }
}


module.exports=auth