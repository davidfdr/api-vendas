import { Response, Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import ResetPasswordController from '../controller/ResetPasswordController';
import ForgotPasswordController from '../controller/ForgotPasswordController';
import SendForgotPasswordEmailService from '../services/SendForgotPasswordEmailService';

const passwordRouter = Router();
const resetPasswordController = new ResetPasswordController();
const forgotPasswordController = new ForgotPasswordController();

passwordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  resetPasswordController.reset,
);

passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPasswordController.forgot,
);

passwordRouter.patch(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  async (request, response): Promise<Response> => {
    const { email } = request.body;
    const sendForgotPasswordEmailService = new SendForgotPasswordEmailService();

    await sendForgotPasswordEmailService.execute({
      email,
    });

    return response.status(204).json();
  },
);

export default passwordRouter;
