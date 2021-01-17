import * as iam from "@aws-cdk/aws-iam";
import { AccountPrincipal, PolicyStatement } from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";

export function S3Stack(scope: cdk.Construct) {
  const privateBucket = new s3.Bucket(scope, "privateBucket", {
    bucketName: "tp-private-pragmatic-terraform",
    versioned: true,
    encryption: s3.BucketEncryption.S3_MANAGED,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  });

  const publicBucket = new s3.Bucket(scope, "publicBucket", {
    bucketName: "tp-public-pragmatic-terraform",
    accessControl: s3.BucketAccessControl.PUBLIC_READ,
    cors: [
      {
        allowedOrigins: ["https://example.com"],
        allowedMethods: [s3.HttpMethods.GET],
        allowedHeaders: ["*"],
        maxAge: 3000,
      },
    ],
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  });

  const logBucket = new s3.Bucket(scope, "LogBucket", {
    bucketName: "tp-alb-log-pragmatic-terraform",
    lifecycleRules: [
      {
        enabled: true,
        expiration: cdk.Duration.days(180),
      },
    ],
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  });
  logBucket.addToResourcePolicy(
    new PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:PutObject"],
      resources: [`${logBucket.bucketArn}/*`],
      principals: [new AccountPrincipal("582318560864")],
    })
  );
}
