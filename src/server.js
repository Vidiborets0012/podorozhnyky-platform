import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import helmet from 'helmet';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectMongoDB } from './db/connectMongoDB.js';
import authRoutes from './routes/authRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import { API_PREFIX } from './constants/api.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger);
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello world!' });
});

// app.use(authRoutes);
// app.use('/api/auth', authRoutes);

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, usersRoutes);
app.use(`${API_PREFIX}/categories`, categoriesRoutes);

app.use(notFoundHandler);

app.use(errors());

app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
