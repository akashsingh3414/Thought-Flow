import express from 'express'
import dotenv from 'dotenv'
import connectToMongoDB from './db/index.js';

dotenv.config();

dotenv.config({
    path: './env'
})

const app = express();


connectToMongoDB().then(()=>{
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    })
}).catch((error)=>{
    console.log("nMongoDB Connection Failed!", error)
})




