import * as kms from "@aws-cdk/aws-kms";
import * as cdk from "@aws-cdk/core";

export function KmsStack(scope: cdk.Construct) {
  new kms.Key(scope, "ExampleKey", {
    description: "Example Customer Master Key",
    enableKeyRotation: true,
    enabled: true,
    pendingWindow: cdk.Duration.days(30),
  }).addAlias("alias/example");
}
