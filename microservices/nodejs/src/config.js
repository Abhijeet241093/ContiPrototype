
import dotenv from 'dotenv'
import path from 'path'
const __dirname = path.resolve();
dotenv.config({ path:path.join(__dirname, './.env') });

export default {
    jwtKey: process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : process.env.JWT_SECRET_TEST,
    aws: {
        access_id: process.env.NODE_ENV === 'production' ? process.env.AWS_ACCESS_ID : process.env.TEST_AWS_ACCESS_ID,  //! note
        access_key: process.env.NODE_ENV === 'production' ? process.env.AWS_ACCESS_KEY : process.env.TEST_AWS_ACCESS_KEY,//! note
        bucket_s3: process.env.NODE_ENV === 'production' ? process.env.AWS_BUCKET_S3 : process.env.TEST_AWS_BUCKET_S3,
    },
};
