import AWS from "aws-sdk";
import config from"../config.js";
import _ from "lodash";

const s3 = new AWS.S3({
    accessKeyId: config.aws.access_id,
    secretAccessKey: config.aws.access_key,
    region: "ap-northeast-2",
    signatureVersion: "v4",
 });


export const createPublicUrl = async (key, time, type = config.aws.bucket_s3) => {
    let params = {
       Bucket: type,
       Key: key,
       Expires: _.toNumber(time),
    };
    return await s3.getSignedUrl("getObject", params);
 };

