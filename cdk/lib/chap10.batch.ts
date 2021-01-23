import { Vpc } from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import { LogDriver } from "@aws-cdk/aws-ecs";
import { Rule, Schedule } from "@aws-cdk/aws-events";
import "@aws-cdk/aws-events-targets";
import { EcsTask } from "@aws-cdk/aws-events-targets";
import { RetentionDays } from "@aws-cdk/aws-logs";
import * as cdk from "@aws-cdk/core";
interface BatchProps {
  vpc: Vpc;
}
export function BatchStack(scope: cdk.Construct, props: BatchProps) {
  const cluster = new ecs.Cluster(scope, "ExampleBatch", { vpc: props.vpc });
  const taskDefinition = new ecs.FargateTaskDefinition(
    scope,
    "ExampleBatchTask"
  );
  taskDefinition.addContainer("DateBatchTask", {
    image: ecs.ContainerImage.fromRegistry("alpine:latest"),
    logging: LogDriver.awsLogs({
      streamPrefix: "/ecs-scheduled-tasks/example",
      logRetention: RetentionDays.TWO_WEEKS,
    }),
    command: ["/bin/date"],
  });
  new ecs.FargateService(scope, "ExampleTaskFargate", {
    cluster,
    taskDefinition,
  });
  const rule = new Rule(scope, "ExampleBatchRule", {
    description: "Important Batch",
    schedule: Schedule.expression("cron(*/2 * * * ? *)"),
  });
  rule.addTarget(new EcsTask({ cluster, taskDefinition }));
}
