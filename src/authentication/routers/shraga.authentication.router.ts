import { Router } from 'express';
import { ShragaAuthenticationHandler as AuthenticationHandler } from '../authentication.handler';
const passport = require('passport');

const ShragaAuthenticationRouter = Router();

ShragaAuthenticationRouter.get('/login', AuthenticationHandler.authenticate());

ShragaAuthenticationRouter.post('/callback', passport.authenticate('shraga'), AuthenticationHandler.handleUser);

export { ShragaAuthenticationRouter };
