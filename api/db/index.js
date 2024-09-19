import mongoose from 'mongoose'

const connectToMongoDB = async () => {
    try {
        const connectInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`MongoDB Connected Successfully ${connectInstance.connection.host}`)
    } catch (error) {
        console.log(`\nUnable to connect to MongoDB`, error)
        process.exit(1)
    }
}

export default connectToMongoDB;