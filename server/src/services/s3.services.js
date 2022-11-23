import AWS from "aws-sdk"
import _ from "lodash";
import config from '../config.js';

const s3 = new AWS.S3({
    accessKeyId: config.aws.access_id,
    secretAccessKey: config.aws.access_key,
    region: "ap-northeast-2",
    signatureVersion: "v4",
});

const createPublicUrl = async (key, time = 10000, type = config.aws.bucket_s3) => {
    let params = {
        Bucket: type,
        Key: key,
        Expires: _.toNumber(time),
    };
    return await s3.getSignedUrl("getObject", params);
};

const createPublicPutUrl = async (key, typeFile, time = 10000, type = config.aws.bucket_s3) => {
    let params = {
        Bucket: type,
        Key: key,
        Expires: _.toNumber(time),
        ContentType: typeFile
    };
    return await s3.getSignedUrl("putObject", params);
};
const putFile = async (key, buffer, type = config.aws.bucket_s3) => {
    let params = {
        Bucket: type,
        Key: key,
        Body: buffer,
    }
    return await s3.upload(params).promise();
};
const deleteFiles = async (list, type = config.aws.bucket_s3) => {
    let params = {
        Bucket: type,
        Delete: {
            Objects: list,
        },
    };
    return await s3.deleteObjects(params).promise();
};
const deleteFile = async (key, type = config.aws.bucket_s3) => {
    let params = {
        Bucket: type,
        Key: key,
    };
    return await s3.deleteObject(params).promise();
};
const headFile = async (key, type = config.aws.bucket_s3) => {
    let params = {
        Bucket: type,
        Key: key
    };
    return await s3.headObject(params).promise();
};
const getFiles = async (prefix, type = config.aws.bucket_s3) => {
    let params = {
        Bucket: type,
        MaxKeys: 2147483647,
        Delimiter: "/",
        Prefix: prefix,
    };
    return await s3.listObjectsV2(params).promise();
};



export {
    createPublicUrl,
    createPublicPutUrl,
    deleteFiles,
    deleteFile,
    putFile,
    headFile,
    getFiles,
    
};
