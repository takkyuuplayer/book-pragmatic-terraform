import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import { IamRoleStack } from "./iam_role/index";

export class IamStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new IamRoleStack(this, "DescribeRegionForEc2", {
      name: "describe-regions-for-ec2",
      identifier: "ec2.amazonaws.com",
      policy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            resources: ["*"],
            actions: ["ec2:DescribeRegions"],
            effect: iam.Effect.ALLOW,
          }),
        ],
      }),
    });
  }
}
