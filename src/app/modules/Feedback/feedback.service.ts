import { JwtPayload } from 'jsonwebtoken';
import { IFeedback } from './feedback.interface';
import { Feedback } from './feedback.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createFeedbackToDB = async (user: JwtPayload, payload: IFeedback) => {
  payload.userId = user?.userId; // Set the userId field from the JWT payload

  const result = await Feedback.create(payload);
  return result;
};

const getAllFeedbacksFromDB = async (query: Record<string, unknown>) => {
  // Build the query using QueryBuilder with the given query parameters
  const feedbacksQuery = new QueryBuilder(
    Feedback.find().populate({
      path: 'userId',
      select: 'fullName avatar',
    }),
    query,
  )
    .sort() // Apply sorting based on the query parameter
    .paginate() // Apply pagination based on the query parameter
    .fields(); // Select specific fields to include/exclude in the result

  // Get the total count of matching documents and total pages for pagination
  const meta = await feedbacksQuery.countTotal();
  // Execute the query to retrieve the reviews
  const result = await feedbacksQuery.modelQuery;

  return { meta, result };
};

export const FeedbackServices = {
  createFeedbackToDB,
  getAllFeedbacksFromDB,
};
