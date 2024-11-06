import express, { Request, Response } from 'express';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import requestLogger from './app/middlewares/requestLogger';
import router from './app/routes';

const app = express();

// middlewares
app.use(cors());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(express.static('uploads'));
app.use(express.static('uploads'));

//static file check

// Default route for the root URL
app.get('/', (req: Request, res: Response) => {
  const serverStatus = {
    status: 'running',
    message: 'Sic Social API is operational and running smoothly.',
    timestamp: new Date().toISOString(),
    version: 'v1.0.1',
    uptime: process.uptime(),
    author: {
      name: 'Ibrahim Khalil',
      email: 'iibrahiim.dev@gmail.com',
      website: 'https://iibrahim-dev.netlify.app/',
    },
    contact: {
      support: 'iibrahiim.dev@gmail.com',
      website: 'https://iibrahim-dev.netlify.app/',
    },
  };

  res.json(serverStatus);
});

// Application routes under the '/api/v1' path
app.use('/api/v1', router);

// Error-handling middlewares
app.use(globalErrorHandler); // Global error handler middleware
app.use(notFound); // Middleware to handle 404 - Not Found errors

export default app;
