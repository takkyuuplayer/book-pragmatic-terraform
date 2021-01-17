import * as acm from "@aws-cdk/aws-certificatemanager";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2";
import {
  ApplicationListenerRule,
  ApplicationTargetGroup,
  ListenerAction,
  ListenerCondition,
  TargetType,
} from "@aws-cdk/aws-elasticloadbalancingv2";
import { ARecord, HostedZone, RecordTarget } from "@aws-cdk/aws-route53";
import { LoadBalancerTarget } from "@aws-cdk/aws-route53-targets";
import { Bucket } from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";
import { Duration } from "@aws-cdk/core";

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
  const certificate = new acm.Certificate(scope, "Certificate", {
    domainName: "test.takkyuuplayer.com",
    validation: acm.CertificateValidation.fromDns(zone),
  });
  const listener = lb.addListener("https", {
    port: 443,
    protocol: elbv2.ApplicationProtocol.HTTPS,
    certificates: [certificate],
    // defaultAction: ListenerAction.fixedResponse(200, {
    //   contentType: "text/plain",
    //   messageBody: "This is HTTPS",
    // }),
  });
  lb.addListener("redirect_http_to_https", {
    port: 8080,
    protocol: elbv2.ApplicationProtocol.HTTP,
    defaultAction: ListenerAction.redirect({
      port: "443",
      protocol: elbv2.ApplicationProtocol.HTTPS,
      permanent: true,
    }),
  });

  const tg = new ApplicationTargetGroup(scope, "exampleTargetGroup", {
    targetType: TargetType.IP,
    vpc: props.vpc,
    port: 80,
    protocol: elbv2.ApplicationProtocol.HTTPS,
    deregistrationDelay: Duration.seconds(300),
  });
  listener.addTargetGroups("example", {
    targetGroups: [tg],
  });
  new ApplicationListenerRule(scope, "exampleApplicationListenerRule", {
    listener,
    priority: 100,
    action: ListenerAction.forward([tg], {}),
    conditions: [ListenerCondition.pathPatterns(["/*"])],
  });

  new cdk.CfnOutput(scope, "DomainName", {
    exportName: "DomainName",
    value: rec.domainName,
  });
}
