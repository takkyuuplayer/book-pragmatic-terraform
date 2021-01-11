import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam'

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const policyDocument = new iam.PolicyDocument({
        statements: [
            new iam.PolicyStatement({
                resources: ["*"],
                actions: [
                    "ec2:DescribeRegions",
                ],
                effect: iam.Effect.ALLOW,
            })
        ]
    })
    const policy = new iam.Policy(this, "example", {
        document: policyDocument,
    })
  }
}
