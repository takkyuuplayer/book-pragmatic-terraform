import * as ec2 from "@aws-cdk/aws-ec2";
import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2";
import { ListenerAction } from "@aws-cdk/aws-elasticloadbalancingv2";
import { ARecord, HostedZone, RecordTarget } from "@aws-cdk/aws-route53";
import { LoadBalancerTarget } from "@aws-cdk/aws-route53-targets";
import { Bucket } from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";

interface AlbProps {
  vpc: ec2.Vpc;
  logBucket: Bucket;
}

export function AlbStack(scope: cdk.Construct, props: AlbProps): void {
  const lb = new elbv2.ApplicationLoadBalancer(scope, "LB", {
    vpc: props.vpc,
    loadBalancerName: "example",
    internetFacing: true,
  });
  lb.logAccessLogs(props.logBucket);
  lb.addListener("http", {
    port: 80,
    protocol: elbv2.ApplicationProtocol.HTTP,
    defaultAction: ListenerAction.fixedResponse(200, {
      contentType: "text/plain",
      messageBody: "This is HTTP",
    }),
  });
  new cdk.CfnOutput(scope, "LBDNS", {
    exportName: "AlbDnsName",
    value: lb.loadBalancerDnsName,
  });

  const zone = HostedZone.fromLookup(scope, "takkyuuplayer.com", {
    domainName: "takkyuuplayer.com",
  });
  const rec = new ARecord(scope, "example", {
    zone,
    recordName: `test.${zone.zoneName}`,
    target: RecordTarget.fromAlias(new LoadBalancerTarget(lb)),
  });
  new cdk.CfnOutput(scope, "DomainName", {
    exportName: "DomainName",
    value: rec.domainName,
  });
}
