import cors from 'cors';
import express, { type Application } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import { logger } from './config/logger';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found';
import { responseFormatter } from './middleware/response-formatter';
import { healthRouter } from './modules/health/health.routes';

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 120,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

  app.use(responseFormatter);
  app.use('/api/health', healthRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export const app = createApp();
