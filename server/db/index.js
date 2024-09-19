import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config({
    path: '.../env'
})

const connectToMongoDB = async () => {
    try {
        const connectInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log(`MongoDB Connected Successfully ${connectInstance.connection.host}`)
    } catch (error) {
        console.log(`\nUnable to connect to MongoDB`, error)
        process.exit(1)
    }
}

export default connectToMongoDB;