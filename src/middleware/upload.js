const multer=require('multer')

const upload= multer({
 
    limits:{
        fileSize:4000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg)/)){
            return cb(new Error('Only .jpg is accepted'))
        }

        cb (undefined,true)
        /* cb(new Error('File must be image extension'))
        cb (undefined, true)
        cb(u ndefined,false)*/
    }
})


module.exports=upload