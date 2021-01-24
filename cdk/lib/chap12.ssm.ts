import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecspatterns from "@aws-cdk/aws-ecs-patterns";
import * as events from "@aws-cdk/aws-events";
import { RetentionDays } from "@aws-cdk/aws-logs";
import * as secretsmanager from "@aws-cdk/aws-secretsmanager";
import * as ssm from "@aws-cdk/aws-ssm";
import * as cdk from "@aws-cdk/core";

interface BatchProps {
  vpc: ec2.Vpc;
}
export function SsmStack(
  scope: cdk.Construct,
  props: BatchProps
): {
  credentials: {
    username: ssm.StringParameter;
    password: secretsmanager.Secret;
  };
} {
  const plain = new ssm.StringParameter(scope, "ExamplePlainText", {
    parameterName: "/db/username",
    stringValue: "root",
  });
  const secret = new secretsmanager.Secret(scope, "Secret", {
    secretName: "/db/password",
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    generateSecretString: {
      excludeCharacters: "!@#$%^&*",
    },
  });
  const cluster = new ecs.Cluster(scope, "ExampleSsmBatch", { vpc: props.vpc });
  new ecspatterns.ScheduledFargateTask(scope, "EnvTask", {
    cluster,
    scheduledFargateTaskImageOptions: {
      image: ecs.ContainerImage.fromRegistry("alpine:latest"),
      logDriver: ecs.LogDriver.awsLogs({
        streamPrefix: "/ecs-scheduled-tasks/ssm-example",
        logRetention: RetentionDays.TWO_WEEKS,
      }),
      command: ["/usr/bin/env"],
      secrets: {
        DB_USERNAME: ecs.Secret.fromSsmParameter(plain),
        DB_PASSWORD: ecs.Secret.fromSecretsManager(secret),
      },
    },
    schedule: events.Schedule.expression("rate(1 minute)"),
  });

  return {
    credentials: {
      username: plain,
      password: secret,
    },
  };
}
