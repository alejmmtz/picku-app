import express from 'express';
import cors from 'cors';
import { env } from './config/index.js';
import { authRouter } from './features/auth/auth.router.js';
import { errorsMiddleware } from './middlewares/errorsMiddleware.js';

// Express Configuration
const app = express();
app.use(cors());
app.use(express.json());

// Main Route
app.get('/', (req, res) => {
  res.send('The PickU Server is up and running');
});

// Features Routes
app.use('/picku/api/auth', authRouter);

// Error middleware
app.use(errorsMiddleware);

// App Env
if (env.NODE_ENV !== 'production') {
  app.listen(env.PORT, () => {
    console.log(`Server is running on http://localhost:${env.PORT}`);
  });
}

export default app;