import { Router } from 'express';
import { SamlAuthenticationHandler as AuthenticationHandler } from '../authentication.handler';

const SamlAuthenticationRouter = Router();

SamlAuthenticationRouter.get('/login', AuthenticationHandler.authenticate());
SamlAuthenticationRouter.get('/metadata.xml', AuthenticationHandler.sendMetadata);
SamlAuthenticationRouter.all(
	'/metadata.xml/callback',
	AuthenticationHandler.authenticate(),
	AuthenticationHandler.handleUser,
);

export { SamlAuthenticationRouter };
