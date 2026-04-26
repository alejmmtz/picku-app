import express from 'express';
import cors from 'cors';
import { env } from './config/index.js';
import { authRouter } from './features/auth/auth.router.js';
import { chatbotRouter } from './features/chatbot/chatbot.router.js';
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
app.use('/picku/api/chatbot', chatbotRouter);

//Error middleware
app.use(errorsMiddleware);

//App Env
if (env.NODE_ENV !== 'production') {
  app.listen(env.PORT, () => {
    console.log(`Server is running on http://localhost:${env.PORT}`);
  });
}

export default app;
