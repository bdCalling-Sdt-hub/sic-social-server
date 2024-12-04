import { CorsOptions } from 'cors';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';

// whitelist of allowed origins for CORS
const whitelist = ['http://146.190.126.8:4173'];

// CORS options to allow requests only from whitelisted origins
const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    if (whitelist?.indexOf(origin as string) !== -1 || !origin) {
      callback(null, true); // Allow request
    } else {
      callback(
        new ApiError(
          httpStatus.FORBIDDEN,
          'CORS request strictly prohibited from this origin',
        ),
        // Deny request
      );
    }
  },
};

export default corsConfig;
