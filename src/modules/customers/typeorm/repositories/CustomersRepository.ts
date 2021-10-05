import { EntityRepository, Repository } from 'typeorm';
import Customer from '../entities/Customer';

@EntityRepository(Customer)
class CustomersRepository extends Repository<Customer> {
  public async findByName(name: string): Promise<Customer | undefined> {
    const user = await this.findOne({
      where: {
        name,
      },
    });
    return user;
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const user = await this.findOne({
      where: {
        id,
      },
    });
    return user;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const user = await this.findOne({
      where: {
        email,
      },
    });
    return user;
  }
}

export default CustomersRepository;
