import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import isAuthenticated from '../../../shared/middlewares/isAuthenticated';
import ProfileController from '../controller/ProfileController';

const profileRouter = Router();
const profileCotroller = new ProfileController();

profileRouter.use(isAuthenticated);

profileRouter.get('/', profileCotroller.show);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().optional(),
      password_confirmation: Joi.string()
        .valid(Joi.ref('password'))
        .when('password', {
          is: Joi.exist,
          then: Joi.required,
        }),
      old_password: Joi.string(),
    },
  }),
  profileCotroller.update,
);

export default profileRouter;
