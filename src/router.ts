import { Router } from 'express';
import { AuthenticationRouter } from './authentication/authentication.router';

const AppRouter: Router = Router();

AppRouter.use('/api/authentication', AuthenticationRouter);

export { AppRouter };
