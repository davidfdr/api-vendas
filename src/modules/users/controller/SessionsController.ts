import { Request, Response } from 'express';
import CreateSessionsService from '../services/CreateSessionsService';
import User from '../typeorm/entities/Users';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const createSession = new CreateSessionsService();

    const JSONheaders = JSON.stringify(request.headers);

    const userAuth: { user: User; token: string } = await createSession.execute(
      {
        email,
        password,
        headers: JSONheaders,
      },
    );

    return response.json(userAuth);
  }
}
