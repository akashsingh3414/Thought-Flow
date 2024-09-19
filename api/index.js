import express from 'express';
import dotenv from 'dotenv';
import connectToMongoDB from './db/index.js';
import userRouter from './routes/user.routes.js';

dotenv.config();

const app = express();

app.use(express.json());

connectToMongoDB().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log("MongoDB Connection Failed!", error);
});

app.use('/api', userRouter);

export { app };
