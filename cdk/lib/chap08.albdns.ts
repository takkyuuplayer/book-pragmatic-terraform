import * as cdk from "@aws-cdk/core";
import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2";
import * as ec2 from "@aws-cdk/aws-ec2";
import { Bucket } from "@aws-cdk/aws-s3";
import { ListenerAction } from "@aws-cdk/aws-elasticloadbalancingv2";

interface AlbProps {
    vpc: ec2.Vpc,
    logBucket: Bucket,
}

export function AlbStack(
    scope: cdk.Construct,
    props: AlbProps,
) {
    const lb = new elbv2.ApplicationLoadBalancer(scope, 'LB', {
        vpc: props.vpc,
        loadBalancerName: "example",
        internetFacing: true,
        deletionProtection: true,
    });
    lb.logAccessLogs(props.logBucket)
    lb.addListener("http", {
        port:80,
        protocol: elbv2.ApplicationProtocol.HTTP,
        defaultAction: ListenerAction.fixedResponse(200, {
            contentType: "text/plain",
            messageBody: "This is HTTP",
        })
    })
    
}
