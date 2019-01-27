import { Router } from 'express';
import { AuthenticationHandler } from './authentication.handler';

const AuthenticationRouter = Router();

AuthenticationRouter.get('/login', AuthenticationHandler.authenticate());
AuthenticationRouter.get('/metadata.xml', AuthenticationHandler.sendMetadata);
AuthenticationRouter.all(
    '/metadata.xml/callback',
    AuthenticationHandler.authenticate(),
    AuthenticationHandler.handleUser,
);

export { AuthenticationRouter };
