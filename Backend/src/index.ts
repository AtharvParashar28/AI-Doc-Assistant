import dotenv from 'dotenv';
dotenv.config(); //Environment variable must load before everything

import express from 'express';
import cors from 'cors';
import singupRoute from './routes/signupRoutes';
import authRoute from './routes/authRoutes';
import usersRoute from './routes/usersRoutes';
import documentRoute from './routes/documentRoutes';
import aiRoute from './routes/aiRoutes';

import { globalErrors } from './middlewares/errorMiddleware';

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (to be mounted)

// user and authentication
app.use('/api/auth', singupRoute);
app.use('/api/auth', authRoute);
app.use('/api', usersRoute);

// Document routes
app.use('/api', documentRoute);

// AI routes
app.use('/api', aiRoute);

// Global error handler
app.use(globalErrors);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

