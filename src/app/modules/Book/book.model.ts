import { Schema, model } from 'mongoose';
import { IBook } from './book.interface';

const bookSchema = new Schema<IBook>(
  {
    createdBy: {
      type: Schema.Types.ObjectId, // MongoDB ObjectId type
      ref: 'User', // Reference to the 'User' model
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    bookPdf: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Create the Book model using the schema
export const Book = model<IBook>('Book', bookSchema);
