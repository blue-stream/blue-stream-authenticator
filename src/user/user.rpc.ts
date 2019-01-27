import { config } from '../config';
import { IUser } from './user.interface';

const jayson = require('jayson/promise');

export class UsersRpc {
    private static rpcClient = jayson.Client.http(`${config.users.endpoint}:${config.users.port}`);

    static async getUserById(id: string) {
        const response = await UsersRpc.rpcClient.request(config.users.methods.GET_USER_BY_ID, { id });

        return response.result;
    }

    static async createUser(user: IUser) {
        const response = await UsersRpc.rpcClient.request(config.users.methods.CREATE_USER, user);

        return response.result;
    }
}
