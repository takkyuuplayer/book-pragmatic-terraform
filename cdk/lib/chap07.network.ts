import * as ec2 from "@aws-cdk/aws-ec2";
import { Construct, Tags } from "@aws-cdk/core";
import { SecurityGroupStack } from "./security_group";

export function NetworkStack(
  scope: Construct
): {
  vpc: ec2.Vpc;
  sg: ec2.SecurityGroup;
} {
  const vpc = new ec2.Vpc(scope, "Example", {
    cidr: "10.0.0.0/16",
    enableDnsSupport: true,
    enableDnsHostnames: true,
    maxAzs: 2,
    natGateways: 1,
  });
  Tags.of(vpc).add("Name", "example");

  const sg = SecurityGroupStack(scope, "example_sg", {
    vpc,
    name: "module-sg",
    port: 80,
    cidrBlocks: ["0.0.0.0/0"],
  });

  return { vpc, sg };
}
