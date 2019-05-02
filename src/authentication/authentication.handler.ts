import * as path from 'path';
import * as passport from 'passport';
import { SamlConfig, Strategy } from 'passport-saml';
import { config } from '../config';
import { Application, Response, Request } from 'express';
import { UsersRpc } from '../user/user.rpc';
import { IUser } from '../user/user.interface';
import * as jwt from 'jsonwebtoken';
import { ApplicationError } from '../utils/errors/applicationError';

export class AuthenticationHandler {

    static initialize(app: Application) {
        app.use(passport.initialize());

        passport.serializeUser(AuthenticationHandler.serialize);
        passport.deserializeUser(AuthenticationHandler.deserialize);

        passport.use(new Strategy(
            config.authentication.saml as SamlConfig,
            AuthenticationHandler.verifyUser,
        ));

        return passport.initialize();
    }

    static handleUser(req: Request, res: Response) {
        const userToken = jwt.sign(req.user, config.authentication.secret);

        res.cookie('kd-token', userToken);
        res.redirect(config.clientEndpoint);
    }

    static authenticate() {
        return passport.authenticate('saml', {
            failureRedirect: '/failed',
            failureFlash: true,
        });
    }

    static sendMetadata(req: Request, res: Response) {
        res.sendFile(path.resolve(`${__dirname}/../../assets/metadata.xml`));
    }

    static async verifyUser(profile: any, done: any) {
        const userData: IUser = {
            id: profile[config.authentication.profileExtractor.id],
            firstName: profile[config.authentication.profileExtractor.firstName],
            lastName: profile[config.authentication.profileExtractor.lastName],
            mail: profile[config.authentication.profileExtractor.mail],
        };

        try {
            const user = await UsersRpc.getUserById(userData.mail);
            if (!user) {
                const err = new ApplicationError('User does not exist in the  User service', 500);
                done(err);
            }
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }

    private static serialize(user: { id: string }, done: (err?: Error, id?: string) => void) {
        done(undefined, user.id);
    }

    private static async deserialize(id: string, done: (err?: Error, user?: any) => void) {
        try {
            const user = await UsersRpc.getUserById(id.toLowerCase());
            done(undefined, user);
        } catch (err) {
            done(err, null);
        }
    }
}
