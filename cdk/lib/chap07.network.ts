import { Construct, Tags } from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2"

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

    const sg = new ec2.SecurityGroup(scope, "IngressExample", {
        vpc,
    })
    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80))
}