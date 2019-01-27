import { Request, Response } from 'express';

export class AuthenticationController {
    static get(req: Request, res: Response) {
        res.json({
            hello: 'world',
        });
    }
}
