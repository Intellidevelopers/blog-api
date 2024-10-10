import express from 'express';
import { json } from 'body-parser';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(json());

app.use('/api/auth', authRoutes);
app.use('/api', postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
