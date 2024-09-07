export const IMAGE_FIELD_NAMES = ['image', 'avatar', 'bookImage', 'coverImage'];
export const PDF_FIELD_NAMES = ['bookPdf'];
export const VIDEO_FIELD_NAMES = ['video'];
export const AUDIO_FIELD_NAMES = ['audio'];

export const SUPPORTED_IMAGE_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];
export const SUPPORTED_PDF_FORMATS = ['application/pdf'];
export const SUPPORTED_VIDEO_FORMATS = ['video/mp4'];
export const SUPPORTED_AUDIO_FORMATS = ['audio/mpeg'];

// Create a map for field names and their corresponding supported formats
export const FIELD_NAME_TO_FORMATS: { [key: string]: string[] } = {
  image: SUPPORTED_IMAGE_FORMATS,
  avatar: SUPPORTED_IMAGE_FORMATS,
  bookImage: SUPPORTED_IMAGE_FORMATS,
  coverImage: SUPPORTED_IMAGE_FORMATS,
  bookPdf: SUPPORTED_PDF_FORMATS,
  video: SUPPORTED_VIDEO_FORMATS,
  audio: SUPPORTED_AUDIO_FORMATS,
};
