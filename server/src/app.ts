import express from 'express';
import cors from 'cors';
import { PORT, NODE_ENV } from './config/index.js';
import { authRouter } from './features/auth/auth.router.js';
import { errorsMiddleware } from './middlewares/errorsMiddleware.js';

//Express Configuration
const app = express();
app.use(express.json());
app.use(cors());

//Main Route
app.get('/', (req, res) => {
  res.send('The PickU Server is up and running');
});

//Features Routes
app.use('/picku/api/auth', authRouter);

//Error middleware
app.use(errorsMiddleware);

//App Env
if (NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
