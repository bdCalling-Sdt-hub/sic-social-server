import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../builder/QueryBuilder';
import { UserSearchableFields } from '../User/user.constant';
import { IPayment } from './payment.interface';
import { Payment } from './payment.model';

const savePaymentInfoToDB = async (user: JwtPayload, payload: IPayment) => {
  // Set the createdBy field to the ID of the user who is creating the Payment
  payload.userId = user?.userId;

  // Create the new Payment entry in the database
  const result = await Payment.create(payload);
  return result;
};

const getPaymentsFromDB = async (query: Record<string, unknown>) => {
  const paymentsQuery = new QueryBuilder(
    Payment.find().populate({
      path: 'userId',
      select: 'avatar fullName email address phoneNumber',
    }),

    query,
  )
    .search(UserSearchableFields) // Apply search conditions based on searchable fields
    .sort() // Apply sorting based on the query parameter
    .paginate(); // Apply pagination based on the query parameter

  // Get the total count of matching documents and total pages for pagination
  const meta = await paymentsQuery.countTotal();
  // Execute the query to retrieve the users
  const result = await paymentsQuery.modelQuery;

  return { meta, result };
};

export const PaymentServices = {
  savePaymentInfoToDB,
  getPaymentsFromDB,
};
