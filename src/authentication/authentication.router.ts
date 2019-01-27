import { Router } from 'express';
import { AuthenticationController } from './authentication.contoller';

const AuthenticationRouter: Router = Router();

AuthenticationRouter.get('/', AuthenticationController.get);

export { AuthenticationRouter };
