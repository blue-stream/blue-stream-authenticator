import { Router } from 'express';
import { ShragaAuthenticationHandler as AuthenticationHandler } from '../authentication.handler';
const passport = require('passport');

const ShragaAuthenticationRouter = Router();

ShragaAuthenticationRouter.get('/login', AuthenticationHandler.authenticate());
ShragaAuthenticationRouter.post('/callback', () => {console.log('before passport.authenticate');},passport.authenticate('shraga'), () => {console.log('after passport.authenticate');},AuthenticationHandler.handleUser);

export { ShragaAuthenticationRouter };
