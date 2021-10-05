import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import Customer from '../typeorm/entities/Customer';
import CustomerRepository from '../typeorm/repositories/CustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

class CreateUserService {
  public async execute({ name, email }: IRequest): Promise<Customer> {
    const customerRepository = getCustomRepository(CustomerRepository);

    const customerExists = await customerRepository.findByEmail(email);

    if (customerExists) {
      throw new AppError(
        'There is already one customer with this email. Email already in use.',
      );
    }

    const user = customerRepository.create({
      name,
      email,
    });

    const userCreated = await customerRepository.save(user);

    return userCreated;
  }
}

export default CreateUserService;
