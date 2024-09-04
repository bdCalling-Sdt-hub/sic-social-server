import { Router } from 'express';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { CategoryControllers } from './category.controller';

const router = Router();

router
  .route('/')

  .get(CategoryControllers.getCategories)

  .post(
    validateAuth(USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
    CategoryControllers.createCategory,
  );

router
  .route('/:id')

  .patch(
    validateAuth(USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
    CategoryControllers.updateCategoryById,
  )

  .delete(
    validateAuth(USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
    CategoryControllers.deleteCategoryById,
  );

export const CategoryRoutes = router;
