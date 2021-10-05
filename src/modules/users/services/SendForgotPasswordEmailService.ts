import { getManager } from 'typeorm';
import path from 'path';
import AppError from '@shared/errors/AppError';
import EtherealMail from '@config/mail/EtherealMail';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    await getManager().transaction(async manager => {
      const userTkRp = manager.getCustomRepository(UserTokensRepository);
      const userRp = manager.getCustomRepository(UsersRepository);

      const user = await userRp.findByEmail(email);
      if (!user) {
        throw new AppError('Where is this user? Can´t find this e-mail.');
      }

      const token = await userTkRp.generate(user.id);
      console.log(token);

      const forgotPassewordTemplate = path.resolve(
        __dirname,
        '..',
        'views',
        'forgot_password.hbs',
      );

      await EtherealMail.sendMail({
        to: {
          name: user.name,
          email: user.email,
        },
        subject: '[CCONCENSUS] Recuperação de senha!',
        templateData: {
          file: forgotPassewordTemplate,
          variables: {
            name: user.name,
            token: token.token,
            link: `http://192.168.33.20:3000/reset_password?token=${token.token}`,
          },
        },
      });
    });
  }
}

export default SendForgotPasswordEmailService;
