import * as path from 'path';
import * as passport from 'passport';
import { SamlConfig, Strategy } from 'passport-saml';
import { config } from '../config';
import { Application, Response, Request } from 'express';
import { UsersRpc } from '../user/user.rpc';
import { IUser } from '../user/user.interface';

export class AuthenticationController {

    static initialize(app: Application) {
        app.use(passport.initialize());

        passport.serializeUser(AuthenticationController.serialize);
        passport.deserializeUser(AuthenticationController.deserialize);

        passport.use(new Strategy(
            config.authentication.saml as SamlConfig,
            AuthenticationController.verifyUser,
        ));

        app.get('/login', AuthenticationController.authenticate());
        app.get('/metadata.xml', AuthenticationController.sendMetadata);
        app.all('/metadata.xml/callback', AuthenticationController.authenticate(), (req: any, res: any) => {
            return res.json(req.user);
        });

        return passport.initialize();
    }

    private static authenticate() {
        return passport.authenticate('saml', {
            failureRedirect: '/failed',
            failureFlash: true,
        });
    }

    private static sendMetadata(req: Request, res: Response) {
        res.sendFile(path.resolve(`${__dirname}/../../assets/metadata.xml`));
    }

    private static async verifyUser(profile: any, done: any) {
        const userData: IUser = {
            id: profile[config.authentication.profileExtractor.id],
            firstName: profile[config.authentication.profileExtractor.firstName],
            lastName: profile[config.authentication.profileExtractor.lastName],
            mail: profile[config.authentication.profileExtractor.mail],
        };

        try {
            let user = await UsersRpc.getUserById(userData.id.toLowerCase());
            if (!user) {
                user = await UsersRpc.createUser({ ...userData, id: userData.id.toLowerCase() });
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
