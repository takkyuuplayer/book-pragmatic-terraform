import * as ecr from "@aws-cdk/aws-ecr";
import { TagStatus } from "@aws-cdk/aws-ecr";
import { CfnAccessKey, ManagedPolicy, User } from "@aws-cdk/aws-iam";
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
  const deployUser = new User(scope, "deployUser", {
    userName: "exampleDeployUser",
    managedPolicies: [
      ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonEC2ContainerRegistryPowerUser"
      ),
    ],
  });

  const accessKey = new CfnAccessKey(scope, "myAccessKey", {
    userName: deployUser.userName,
  });
  // new CfnOutput(scope, "accessKeyId", { value: accessKey.ref });
  // new CfnOutput(scope, "secretAccessKey", {
  //   value: accessKey.attrSecretAccessKey,
  // });
}
