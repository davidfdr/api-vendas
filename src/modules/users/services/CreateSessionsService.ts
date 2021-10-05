import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { getCustomRepository } from 'typeorm';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import User from '../typeorm/entities/Users';
import UsersRepository from '../typeorm/repositories/UsersRepository';

const authError = 'There is no user with this e-mail or password!';

interface IRequest {
  email: string;
  password: string;
  headers: string;
}

interface IResponse {
  user: User;
  token: string;
}

class ResponseImpl implements IResponse {
  readonly user: User;
  token: string;
  constructor(user: User, token: string) {
    this.user = user;
    this.token = token;
  }
}

class CreateSessionsService {
  public async execute({
    email,
    password,
    headers,
  }: IRequest): Promise<IResponse> {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(authError);
    }

    const pwdConfirmed = await compare(password, user.password);

    if (!pwdConfirmed) {
      throw new AppError(authError);
    }

    const userAuth = new ResponseImpl(user, 'tokentoken');

    const token = sign({ headers }, authConfig.jwt.secret, {
      subject: userAuth.user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });
    userAuth.token = token;
    return userAuth;
  }
}

export default CreateSessionsService;
