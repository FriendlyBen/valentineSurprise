import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db';
import resultRoutes from './routes/resultRoutes';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/results', resultRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the API!' }); // ✅ Now GET / returns a response
});



// Start Server
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
