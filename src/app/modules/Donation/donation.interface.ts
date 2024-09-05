import { ObjectId } from 'mongoose';

export interface IDonation {
  createdBy: ObjectId; // Reference to the User
  details: {
    title: string;
    image: string;
    content: string;
  };
  rulesAndRegulations: {
    content: string;
  };
  termsAndConditions: {
    content: string;
  };
}
