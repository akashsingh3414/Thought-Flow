import express from 'express';
import dotenv from 'dotenv';
import connectToMongoDB from './db/index.js';
import userRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser'

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

connectToMongoDB().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log("MongoDB Connection Failed!", error);
});

app.use('/api/v1/user', userRouter);

export { app };
