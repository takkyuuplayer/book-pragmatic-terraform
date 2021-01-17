#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { IamStack } from "../lib/chap05.iam";
import { S3Stack } from "../lib/chap06.s3";
import { NetworkStack } from "../lib/chap07.network";
require("dotenv").config();

const app = new cdk.App();
export class MyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.node.setContext(
      `availability-zones:account=${this.account}:region=ap-northeast-1`,
      ["ap-northeast-1a", "ap-northeast-1c", "ap-northeast-1d"]
    );

    IamStack(this);
    S3Stack(this);
    NetworkStack(this);
  }
}

new MyStack(app, "PragmaticTerraformByCDK", {
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});
