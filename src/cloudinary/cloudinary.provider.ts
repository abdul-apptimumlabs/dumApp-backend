import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: 'datzknfak',
      api_key: '912871848886864',
      api_secret: '4enDbVjvzFdQpmxAzGb4FYNXboo',
    });
  },
};
