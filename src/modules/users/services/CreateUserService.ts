import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import User from '../typeorm/entities/Users';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import { hash } from 'bcryptjs';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userExists = await usersRepository.findByName(name);

    if (userExists) {
      throw new AppError('There is already one user with this name');
    }

    const userEmailExists = await usersRepository.findByEmail(email);

    if (userEmailExists) {
      throw new AppError('There is already one user with this e-mail');
    }

    const pwdHash = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: pwdHash,
    });

    const userCreated = await usersRepository.save(user);

    return userCreated;
  }
}

export default CreateUserService;
