import multer from 'multer';
import path from 'path';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import createDirectory from './createDirectory';
import { FIELD_NAME_TO_FORMATS } from '../constants/file.constant';
import getUploadFolder from './getUploadFolder';

// Base directory for uploads
const baseUploadDirectory = path.join(process.cwd(), 'public');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { fieldname } = file;
    // Determine upload folder based on fieldname
    const uploadFolder = getUploadFolder(fieldname);

    if (!uploadFolder) {
      throw new ApiError(
        httpStatus.NOT_ACCEPTABLE,
        'File type is not supported!',
      );
    }

    const uploadDirectory = path.join(baseUploadDirectory, uploadFolder);

    createDirectory(uploadDirectory); // Ensure directory exists
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName =
      file.fieldname + '-' + uniqueSuffix + path.extname(file?.originalname);

    cb(null, fileName);
  },
});

// Multer upload configuration
const upload = multer({
  storage: storage,

  fileFilter: function (req, file, cb) {
    const { fieldname, mimetype } = file;

    // Retrieve the list of supported formats for the given fieldname
    const supportedFormats = FIELD_NAME_TO_FORMATS[fieldname];

    if (supportedFormats) {
      if (supportedFormats.includes(mimetype)) {
        return cb(null, true); // Accept the file
      } else {
        return cb(
          new ApiError(
            httpStatus.NOT_ACCEPTABLE,
            `Unsupported file format for field: '${fieldname}'`,
          ),
        );
      }
    } else {
      return cb(
        new ApiError(
          httpStatus.NOT_ACCEPTABLE,
          `Unsupported field name: '${fieldname}'`,
        ),
      );
    }
  },
});

export { storage, upload };
