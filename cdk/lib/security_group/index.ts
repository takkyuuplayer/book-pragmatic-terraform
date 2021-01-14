import { Construct, Tags } from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2"

interface SecurityGroupProps {
    name: string
    vpc: ec2.Vpc,
    port: number,
    cidrBlocks: Array<string>,
}

export function SecurityGroupStack(scope: Construct, id: string, props: SecurityGroupProps) : ec2.SecurityGroup {
    const sg = new ec2.SecurityGroup(scope, id, {
        allowAllOutbound: true,
        securityGroupName: props.name,
        vpc: props.vpc,
    })
    props.cidrBlocks.forEach((cidrBlock) => {
        sg.addIngressRule(ec2.Peer.ipv4(cidrBlock), ec2.Port.tcp(props.port))
    })

    return sg
}