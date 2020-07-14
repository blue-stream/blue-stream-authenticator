import * as path from 'path';
import * as passport from 'passport';
import { SamlConfig, Strategy as SAMLStrategy } from 'passport-saml';
import { config } from '../config';
import { Application, Response, Request } from 'express';
import { UsersRpc } from '../user/user.rpc';
import { IUser, Name } from '../user/user.interface';
import * as jwt from 'jsonwebtoken';
import { ApplicationError } from '../utils/errors/applicationError';
import { readFile } from 'fs';

const ShragaStrategy = require('passport-shraga').Strategy;

export class AuthenticationHandler {
    static initialize(app: Application) {
        app.use(passport.initialize());
        app.use(passport.session());

        passport.serializeUser(this.serialize);
        passport.deserializeUser(this.deserialize);

        this.configurePassport();
        return passport.initialize();
    }

    protected static serialize(user: { id: string }, done: (err?: Error, id?: string) => void) { }

    protected static deserialize(id: string, done: (err?: Error, user?: any) => void) { }

    protected static configurePassport() { }

    static handleUser(req: Request, res: Response) {
        const minute = 60;
        const hour = 60 * minute;
        const day = 24 * hour;
        const expiresIn = day * config.authentication.daysExpires;

        const iat = Math.floor(Date.now() / 1000);
        const exp = iat + expiresIn;

        const user: IUser = { ...req.user, iat, exp };

        try {
            const name = handleUserName(user);
            user.firstName = name.firstName;
            user.lastName = name.lastName;

        } catch (err) {
            console.log(`Error: ${err} \n User: ${user}; name: ${user.name}; id: ${user.id}`);
            return res.redirect('/auth/unauthorized');
        }

        const constRedirectURI = req.user.RelayState || config.clientEndpoint;
        const userToken = jwt.sign(JSON.parse(JSON.stringify(user)), config.authentication.secret);

        res.cookie(config.authentication.token, userToken);
        res.redirect(constRedirectURI);
    }
}

// handleUserName gets a user and returns the compiled user's firstName+lastName.
// In case there is no firstName inside the user.name it try to take the user's job instead as his firstName
export function handleUserName(user: IUser): Name {
    if (!user.name) {
        throw new Error('User has no name object');
    }

    const firstName = user.name.firstName || user.job;
    if (!firstName) {
        throw new Error('User has no first-name and no job');
    }
    const lastName = user.name.lastName || config.users.defaultLastName;
    return { firstName, lastName };
}

export class SamlAuthenticationHandler extends AuthenticationHandler {
    static authenticate() {
        return passport.authenticate('saml', {
            failureRedirect: '/failed',
            failureFlash: true,
        });
    }

    static sendMetadata(req: Request, res: Response) {
        readFile(path.resolve(`${__dirname}/metadata.xml`), 'utf8', (err, data) => {
            if (err) return res.sendStatus(404);

            const modifiedData = data.replace(/ENDPOINT/g, config.server.endpoint);

            res.set('Content-Type', 'text/xml');
            return res.send(modifiedData);
        });
    }

    static async verifyUser(profile: any, done: any) {
        const userData: IUser = {
            id: profile[config.authentication.profileExtractor.id],
            mail: profile[config.authentication.profileExtractor.mail],
            firstName: profile[config.authentication.profileExtractor.firstName],
            lastName: profile[config.authentication.profileExtractor.lastName],
            job: profile[config.authentication.profileExtractor.job],
        };

        try {
            const user = await UsersRpc.getUserById(userData.id);
            if (!user) {
                const err = new ApplicationError('User does not exist in the  User service', 500);
                done(err);
            }
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }

    protected static serialize(user: { id: string }, done: (err?: Error, id?: string) => void) {
        done(undefined, user.id);
    }

    protected static async deserialize(id: string, done: (err?: Error, user?: any) => void) {
        try {
            const user = await UsersRpc.getUserById(id.toLowerCase());
            done(undefined, user);
        } catch (err) {
            done(err, null);
        }
    }

    protected static configurePassport() {
        passport.use(new SAMLStrategy(
            config.authentication.saml as SamlConfig,
            SamlAuthenticationHandler.verifyUser,
        ));
    }
}

export class ShragaAuthenticationHandler extends AuthenticationHandler {

    protected static serialize(user: { id: string }, done: (err?: Error, id?: string) => void) {
        done(undefined, user.id);
    }

    protected static async deserialize(id: string, done: (err?: Error, id?: any) => void) {
        done(undefined, id);
    }

    protected static configurePassport() {
        const shragaURL = config.authentication.shragaURL;
        const useEnrichId = config.authentication.useEnrichId;
        const allowedProviders = [config.authentication.allowedProvider];
        passport.use(new ShragaStrategy({ shragaURL, useEnrichId, allowedProviders }, (profile: any, done: any) => {
            done(null, profile);
        }));
    }

    static authenticate() {
        return passport.authenticate('shraga', this.handleUser);
    }

    static sendUnauthorized(req: Request, res: Response) {
        res.sendFile(path.resolve(config.authentication.unauthorized));
    }

    static getSupportURL(req: Request, res: Response) {
        res.json(config.support);
    }
}
