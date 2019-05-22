import { IUser } from './user.interface';
import { config } from '../config';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = `${__dirname}/../../proto/users.proto`;

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });
const users_proto = grpc.loadPackageDefinition(packageDefinition).users;
const client = new users_proto.Users(config.users.endpoint,
                                     grpc.credentials.createInsecure());
export class UsersRpc {
    static async getUserById(mail: string): Promise<any> {
        return new Promise((resolve, reject) => {
            client.GetUserByMail({ mail }, (err: any, res: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                const user: IUser = res.user;
                resolve(user);
            });
        });
    }
}
