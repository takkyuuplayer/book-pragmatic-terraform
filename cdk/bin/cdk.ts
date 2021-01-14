#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { IamStack } from "../lib/chap05.iam";
import { S3Stack } from "../lib/chap06.s3";
import { NetworkStack } from "../lib/chap07.network";

const app = new cdk.App();
export class MyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    IamStack(this);
    S3Stack(this);
    NetworkStack(this);
  }
}

new MyStack(app, "PragmaticTerraformByCDK");
