import { EntityRepository, Repository } from 'typeorm';
import Order from '../entities/Order';
import Customer from '@modules/customers/typeorm/entities/Customer';

interface IProduct {
  product_id: string;
  price: number;
  quantity: number;
}

interface IRequest {
  customer: Customer;
  products: IProduct[];
}

@EntityRepository(Order)
class OrdersRepository extends Repository<Order> {
  public async findById(id: string): Promise<Order | undefined> {
    const order = this.findOne(id, {
      relations: ['order_products', 'customer'],
    });

    return order;
  }

  public async createOrder({ customer, products }: IRequest): Promise<Order> {
    const order = this.create({
      customer,
      order_products: products,
    });

    const orderCreated = await this.save(order);

    return orderCreated;
  }

  public async findByCustomerId(id: string): Promise<Order[] | undefined> {
    const order = await this.find({
      where: {
        customer_id: id,
      },
      relations: ['customer', 'order_products'],
    });

    return order;
  }
}

export default OrdersRepository;
