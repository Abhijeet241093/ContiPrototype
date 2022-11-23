
import dotenv from 'dotenv'
import path from 'path'
const __dirname = path.resolve();
dotenv.config({ path: __dirname + '/server/.env' });

export default {
    jwtKey: process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : process.env.JWT_SECRET_TEST,
    aws: {
        access_id: process.env.NODE_ENV === 'production' ? process.env.AWS_ACCESS_ID : process.env.TEST_AWS_ACCESS_ID,  //! note
        access_key: process.env.NODE_ENV === 'production' ? process.env.AWS_ACCESS_KEY : process.env.TEST_AWS_ACCESS_KEY,//! note
        bucket_s3: process.env.NODE_ENV === 'production' ? process.env.AWS_BUCKET_S3 : process.env.TEST_AWS_BUCKET_S3,
        rds_user:
            process.env.NODE_ENV === "production"
                ? process.env.AWS_RDS_USER
                : process.env.TEST_AWS_RDS_USER,
        rds_name:
            process.env.NODE_ENV === "production"
                ? process.env.AWS_RDS_NAME
                : process.env.TEST_AWS_RDS_NAME,
        rds_host:
            process.env.NODE_ENV === "production"
                ? process.env.AWS_RDS_HOST
                : process.env.TEST_AWS_RDS_HOST,
        rds_port:
            process.env.NODE_ENV === "production"
                ? process.env.AWS_RDS_PORT
                : process.env.TEST_AWS_RDS_PORT,
        rds_password:
            process.env.NODE_ENV === "production"
                ? process.env.AWS_RDS_PASSWORD
                : process.env.TEST_AWS_RDS_PASSWORD,
    },
};
