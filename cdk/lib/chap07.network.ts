import { Construct, Tags } from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2"
import { SecurityGroupStack } from "./security_group";

export function NetworkStack(scope: Construct) {
    const vpc = new ec2.Vpc(scope, "Example", {
        cidr: "10.0.0.0/16",
        enableDnsSupport: true,
        enableDnsHostnames: true,
        subnetConfiguration: [
            {
                cidrMask: 24,
                name: "public",
                subnetType: ec2.SubnetType.PUBLIC,
            },
            {
                cidrMask: 24,
                name: "private",
                subnetType: ec2.SubnetType.PRIVATE,
            },
        ],
    })
    Tags.of(vpc).add("Name", "example")

    const sg = SecurityGroupStack(scope, "example_sg", {
        vpc,
        name: "module-sg",
        port: 80,
        cidrBlocks: ["0.0.0.0/0"]
    })
}