import logging
import sys
import boto3
from botocore.exceptions import ClientError
import os

def create_presigned_url( object_name, expiration=3600):

    # Generate a presigned URL for the S3 object
    s3_client = boto3.client('s3',aws_access_key_id="AKIAZQ2GD4AJWOTFTW4N", aws_secret_access_key="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", region_name= "ap-northeast-2",)
    try:
        response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': 'chungangdemo',
                                                            'Key': object_name},
                                                    ExpiresIn=expiration)
    except ClientError as e:
        logging.error(e)
        return None

    # The response contains the presigned URL
    return response


