import { getManager } from 'typeorm';
import { hash } from 'bcryptjs';
import { isAfter, addHours } from 'date-fns';
import AppError from '@shared/errors/AppError';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository';

interface IRequest {
  password: string;
  token: string;
}

class ResetPasswordService {
  public async execute({ password, token }: IRequest): Promise<void> {
    await getManager().transaction(async manager => {
      const tokenRepository = manager.getCustomRepository(UserTokensRepository);
      const usersRepository = manager.getCustomRepository(UsersRepository);

      const tokenFoo = await tokenRepository.findByToken(token);

      if (!tokenFoo) {
        throw new AppError('This token is invalid!');
      }

      const tokenCreatedAt = tokenFoo.created_at;
      const compareDate = addHours(tokenCreatedAt, 2);

      if (isAfter(Date.now(), compareDate)) {
        throw new AppError('This token is expired!');
      }

      const user = await usersRepository.findById(tokenFoo.user_id);

      if (!user) {
        throw new AppError('Where is this user? Cant find this user.');
      }

      user.password = await hash(password, 8);

      const newUser = await usersRepository.save(user);

      console.log(JSON.stringify(tokenFoo));
      console.log(JSON.stringify(newUser));

      tokenRepository.delete({
        id: tokenFoo.id,
      });
      //
    });
  }
}

export default ResetPasswordService;
