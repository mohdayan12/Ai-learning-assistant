import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandle.js';
import authRoutes from './routes/authRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import flashcardRoutes from './routes/flashcardRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import quizRoutes from './routes/quizRoutes.js'
import progressRoutes from './routes/progressRoutes.js'
import { configureCloudinary } from './config/cloudinary.js';




const app =express();

connectDB();
configureCloudinary()
app.use(cors({
    origin:["http://localhost:5173","https://ai-learning-assistant-six.vercel.app"],
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:['Content-Type','Authorization'],
    credentials:true 
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/auth',authRoutes)
app.use('/api/documents',documentRoutes)
app.use('/api/flashcards',flashcardRoutes)
app.use('/api/ai',aiRoutes)
app.use('/api/quizzes',quizRoutes)
app.use('/api/progress',progressRoutes)


 app.use(errorHandler);

 //404 handler
 app.use((req, res) => {
    res.status(404).json({
     success:false,
     error: 'Route not found',
     statusCode:404 });
 });


 const PORT = process.env.PORT || 5000;
 app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
 });

 process.on('unhandledRejection',(err)=>{
    console.error(`Error: ${err.message}`);
    process.exit(1);
 });
