import * as iam from "@aws-cdk/aws-iam";
import { AccountPrincipal, AnyPrincipal, PolicyStatement } from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";

export class S3Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const privateBucket = new s3.Bucket(this, "privateBucket", {
      bucketName: "tp-private-pragmatic-terraform",
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const publicBucket = new s3.Bucket(this, "publicBucket", {
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
    });

    const logBucket = new s3.Bucket(this, "LogBucket", {
      bucketName: "tp-alb-log-pragmatic-terraform",
      lifecycleRules: [
        {
          enabled: true,
          expiration: cdk.Duration.days(180),
        },
      ],
    });
    logBucket.addToResourcePolicy(
      new PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:PutObject"],
        resources: [`${logBucket.bucketArn}/*`],
        principals: [
          new AccountPrincipal("582318560864"),
        ]
      }),
    )
  }
}
