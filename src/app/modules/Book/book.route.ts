import { Router } from 'express';
import { upload } from '../../helpers/uploadConfig';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { BookControllers } from './book.controller';

const router = Router();

router
  .route('/')

  .get(BookControllers.getBooks)

  .post(
    validateAuth(USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
    upload.fields([
      { name: 'coverImage', maxCount: 1 },
      { name: 'pdf', maxCount: 1 },
    ]),
  
    BookControllers.createBook,
  );

router
  .route('/:id')

  .get(BookControllers.getBookById)

  .patch(
    validateAuth(USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
    upload.fields([
      { name: 'coverImage', maxCount: 1 },
      { name: 'pdf', maxCount: 1 },
    ]),
    BookControllers.updateBookById,
  )

  .delete(
    validateAuth(USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
    BookControllers.deleteBookById,
  );

export const BookRoutes = router;
