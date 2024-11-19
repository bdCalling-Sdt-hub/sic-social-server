import crypto from 'crypto';
export const generateNumericUID = (userId: string) => {
  const hash = crypto.createHash('md5').update(userId).digest('hex');
  // Convert hash to an integer and take a portion (e.g., first 8 characters as an integer)
  return parseInt(hash.substring(0, 8), 16);
};
