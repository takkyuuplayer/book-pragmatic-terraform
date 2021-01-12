#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { IamStack } from "../lib/chap05.iam";
import { S3Stack } from "../lib/chap06.s3";

const app = new cdk.App();
new IamStack(app, "CdkStack");
new S3Stack(app, "PragmaticTerraformS3");
