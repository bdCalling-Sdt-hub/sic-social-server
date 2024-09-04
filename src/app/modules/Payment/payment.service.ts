import { JwtPayload } from 'jsonwebtoken';
import { IPayment } from './payment.interface';
import { Payment } from './payment.model';

const savePaymentInfoToDB = async (user: JwtPayload, payload: IPayment) => {
  // Set the createdBy field to the ID of the user who is creating the Payment
  payload.userId = user?.userId;

  // Create the new Payment entry in the database
  const result = await Payment.create(payload);
  return result;
};

const getPaymentsFromDB = async () => {
  // Fetch all Payment entries from the database
  const result = await Payment.find();
  return result;
};

export const PaymentServices = {
  savePaymentInfoToDB,
  getPaymentsFromDB,
};
