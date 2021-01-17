import { SubnetType, Vpc } from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import { ApplicationTargetGroup } from "@aws-cdk/aws-elasticloadbalancingv2";
import { Construct } from "@aws-cdk/core";
import { SecurityGroupStack } from "./security_group";

interface EcsProps {
  vpc: Vpc;
  albTargetGroup: ApplicationTargetGroup;
}

export function EcsStack(scope: Construct, props: EcsProps): void {
  const cluster = new ecs.Cluster(scope, "Cluster", {
    vpc: props.vpc,
  });
  const taskDefinition = new ecs.FargateTaskDefinition(scope, "task");
  taskDefinition
    .addContainer("NginxTask", {
      image: ecs.ContainerImage.fromRegistry("nginx:latest"),
    })
    .addPortMappings({
      protocol: ecs.Protocol.TCP,
      containerPort: 80,
    });
  new ecs.FargateService(scope, "NginxFargate", {
    cluster,
    taskDefinition,
    desiredCount: 2,
    assignPublicIp: false,
    securityGroups: [
      SecurityGroupStack(scope, "NginxFargateSG", {
        name: "NginxFargateSG",
        vpc: props.vpc,
        port: 80,
        cidrBlocks: [props.vpc.vpcCidrBlock],
      }),
    ],
    vpcSubnets: props.vpc.selectSubnets({ subnetType: SubnetType.PRIVATE }),
  }).attachToApplicationTargetGroup(props.albTargetGroup);
}
