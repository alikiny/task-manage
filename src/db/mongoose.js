const mongoose= require('mongoose')
// const validator= require('validator')

mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify:false
});
// const db = mongoose.connection
// db.on('error', console.error.bind(console, 'connection error:'))
// db.once('open', function() {
//     console.log('Connect')
//   // we're connected!
// })



// const user2= new User({
//     name:'Krishtina',
//     email: 'kieunguyen@gmail.com',
//     age: 19
// })

// user2.save().then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log(error)
// })

/* const user3= new User({
    name:'Mielen',
    email: 'Milesti@hotmail.com',
    age: 34
})

user3.save().then((result)=>{
    console.log(result)
}).catch((error)=>{
    console.log(error)
}) */

/* const user4= new User({
    name:'David',
    email: 'dav@gmail.com',
    age: 29,
    career: 'teacher'
})

user4.save().then((result)=>{
    console.log(result)
}).catch((error)=>{
    console.log(error)
}) */

/* const user5= new User({
    name:'Henry',
    email: 'henry@gmail.com',
    age: 29,
    career: 'teacher',
    password: '35yk@he'
})

user5.save().then((result)=>{
    console.log(result)
}).catch((error)=>{
    console.log(error)
}) */