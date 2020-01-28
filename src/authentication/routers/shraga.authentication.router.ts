import { Router } from 'express';
import { ShragaAuthenticationHandler as AuthenticationHandler } from '../authentication.handler';
import * as passport from 'passport';

const ShragaAuthenticationRouter = Router();

ShragaAuthenticationRouter.get('/login', AuthenticationHandler.authenticate());
ShragaAuthenticationRouter.post('/callback', passport.authenticate('shraga'), AuthenticationHandler.handleUser);

export { ShragaAuthenticationRouter };
