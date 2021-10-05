import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Order from '../typeorm/entities/Order';
import OrdersRepository from '../typeorm/repositories/OrdersRepository';

interface IRequest {
  customer_id: string;
}

class ListCustomerOrdersService {
  public async execute({ customer_id }: IRequest): Promise<Order[]> {
    const ordersRepository = getCustomRepository(OrdersRepository);

    const order = await ordersRepository.findByCustomerId(customer_id);

    if (!order) {
      throw new AppError(
        'This user does not have any order. Please, try again.',
      );
    }

    return order;
  }
}

export default ListCustomerOrdersService;
