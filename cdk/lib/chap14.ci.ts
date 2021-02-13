import * as ecr from "@aws-cdk/aws-ecr";
import { TagStatus } from "@aws-cdk/aws-ecr";
import * as cdk from "@aws-cdk/core";

export function CIStack(scope: cdk.Construct) {
  new ecr.Repository(scope, "Repository", {
    repositoryName: "example",
    imageScanOnPush: true,
    lifecycleRules: [
      {
        rulePriority: 1,
        description: "Keep last 30 release tagged images",
        tagStatus: TagStatus.TAGGED,
        tagPrefixList: ["release"],
        maxImageCount: 30,
      },
    ],
  });
}
