import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import * as path from "path";
// import entire AWS SDK
import *  as AWS from 'aws-sdk';
// import individual service
import * as S3 from 'aws-sdk/clients/s3';
import { ConfigService } from '@nestjs/config';

// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html
@Injectable()
export class S3Service {

    region: string;
    access_token: string;
    secret_token: string;
    s3: S3;

    constructor(config: ConfigService) {
        this.region = config.get("AWS_REGION") || '';
        this.access_token = config.get("AMAZON_ACCESS_KEY")
        this.secret_token = config.get("AMAZON_SECRET_KEY")

        // Set credentials
        AWS.config.update({
            region: this.region,
            accessKeyId: this.access_token,
            secretAccessKey: this.secret_token
        });
        AWS.config.getCredentials(function (err) {
            if (err) console.log(err.stack);
            // credentials not loaded
            else {
                console.log("AWS credentials:", AWS.config.credentials);
            }
        });
        this.s3 = new S3();
    }

    // Call S3 to list the buckets
    listBuckets(): Promise<S3.Buckets | undefined> {
        return new Promise((resolve, reject) => {
            this.s3.listBuckets(function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Buckets);
                }
            });
        });
    }

    // Call S3 to create the bucket
    createBucket(bucketName: string): Promise<S3.Location | undefined> {
        const bucketParams = {
            Bucket: bucketName,
            ACL: 'public-read'
        };
        return new Promise((resolve, reject) => {
            this.s3.createBucket(bucketParams, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Location);
                }
            });
        });
    }

    // Call S3 to create the bucket
    uploadFile(bucketName: string, file: Express.Multer.File): Promise<S3.Location | undefined> {
        let key = `${file.originalname}/${file.size}/${Date.now()}`;
        const uploadParams = { Bucket: bucketName, Key: key, Body: file.buffer };

        // call S3 to retrieve upload file to specified bucket
        return new Promise((resolve, reject) => {
            this.s3.upload(uploadParams, function (err, data) {
                if (err) {
                    reject(err);
                }
                if (data) {
                    resolve(data.Location);
                }
            });
        });
    }

    // Call S3 to create the bucket
    listObjects(bucketName: string): Promise<S3.ListObjectsOutput | undefined> {
        const bucketParams = {
            Bucket: bucketName
        };
        return new Promise((resolve, reject) => {
            this.s3.listObjects(bucketParams, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    // Call S3 to delete the bucket
    // The bucket must be empty in order to delete it.
    deleteBucket(bucketName: string): Promise<{}> {
        const bucketParams = {
            Bucket: bucketName
        };
        return new Promise((resolve, reject) => {
            this.s3.deleteBucket(bucketParams, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    // Call S3 to delete object
    deleteObject(bucketName: string, key: string): Promise<S3.DeleteObjectOutput> {
        const bucketParams = {
            Bucket: bucketName,
            Key: key
        };
        return new Promise((resolve, reject) => {
            this.s3.deleteObject(bucketParams, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    // Call S3 to retrieve policy for selected bucket
    getBucketPolicy(bucketName: string): Promise<S3.Policy> {
        const bucketParams = {
            Bucket: bucketName
        };
        return new Promise((resolve, reject) => {
            this.s3.getBucketPolicy(bucketParams, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Policy);
                }
            });
        });
    }

    // Call S3 to retrieve policy for selected bucket
    putBucketPolicy(bucketName: string): Promise<{}> {
        // https://docs.aws.amazon.com/AmazonS3/latest/dev/using-with-s3-actions.html
        const readOnlyAnonUserPolicy = {
            Version: "2012-10-17",
            Statement: [
                {
                    Sid: `${Date.now()}`,
                    Effect: "Allow",
                    Principal: "*",
                    Action: [
                        "s3:GetObject"
                    ],
                    Resource: [
                        `arn:aws:s3:::${bucketName}/*`
                    ]
                }
            ]
        };
        // convert policy JSON into string and assign into params
        const bucketPolicyParams = { Bucket: bucketName, Policy: JSON.stringify(readOnlyAnonUserPolicy) };

        return new Promise((resolve, reject) => {
            this.s3.putBucketPolicy(bucketPolicyParams, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    // Call S3 to delete policy for selected bucket
    deleteBucketPolicy(bucketName: string): Promise<{}> {
        const bucketParams = { Bucket: bucketName };
        return new Promise((resolve, reject) => {
            this.s3.deleteBucketPolicy(bucketParams, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

}