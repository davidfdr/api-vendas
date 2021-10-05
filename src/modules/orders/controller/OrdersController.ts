import { Request, Response } from 'express';
import CreateOrderService from '../services/CreateOrderService';
import ListCustomerOrdersService from '../services/ListCustomerOrderService';
import ShowOrderService from '../services/ShowOrderService';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showOrder = new ShowOrderService();

    const order = await showOrder.execute({ id });

    return response.json(order);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { customer_id, products } = request.body;

    const createOrder = new CreateOrderService();

    const order = await createOrder.execute({
      customer_id,
      products,
    });

    return response.json(order);
  }

  public async listCustomerOrders(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { customer_id } = request.params;

    const listCustomerOrders = new ListCustomerOrdersService();

    const order = await listCustomerOrders.execute({ customer_id });

    return response.json(order);
  }
}
