import dotenv from 'dotenv';
dotenv.config(); //Environment variable must load before everything

import express from 'express';
import cors from 'cors';
import singupRoute from './routes/signupRoutes';
import authRoute from './routes/authRoutes';
import usersRoute from './routes/usersRoutes';
import { globalErrors } from './middlewares/errorMiddleware';

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (to be mounted)
app.use('/api/auth', singupRoute);
app.use('/api/auth', authRoute);
app.use('/api', usersRoute);

// Global error handler
app.use(globalErrors);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

