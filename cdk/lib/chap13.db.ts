import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  SubnetType,
  Vpc,
} from "@aws-cdk/aws-ec2";
import { Key } from "@aws-cdk/aws-kms";
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  MysqlEngineVersion,
  OptionGroup,
  ParameterGroup,
} from "@aws-cdk/aws-rds";
import { Secret } from "@aws-cdk/aws-secretsmanager";
import { StringParameter } from "@aws-cdk/aws-ssm";
import * as cdk from "@aws-cdk/core";
import { Duration, RemovalPolicy, SecretValue } from "@aws-cdk/core";

interface DatastoreProps {
  vpc: Vpc;
  key: Key;
  credentials: {
    username: StringParameter;
    password: Secret;
  };
}
export function DatastoreStack(scope: cdk.Construct, props: DatastoreProps) {
  const engine = DatabaseInstanceEngine.mysql({
    version: MysqlEngineVersion.VER_5_7,
  });
  const db = new DatabaseInstance(scope, "RdsExample", {
    vpc: props.vpc,
    vpcSubnets: {
      subnetType: SubnetType.PRIVATE,
    },
    multiAz: true,
    engine,
    credentials: Credentials.fromPassword(
      props.credentials.username.stringValue,
      SecretValue.secretsManager(props.credentials.password.secretArn)
    ),
    instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.SMALL),
    allocatedStorage: 20,
    maxAllocatedStorage: 100,
    storageEncryptionKey: props.key,
    preferredBackupWindow: "09:10-09:40",
    backupRetention: Duration.days(30),
    preferredMaintenanceWindow: "mon:10:10-mon:10:40",
    removalPolicy: RemovalPolicy.DESTROY,
    optionGroup: new OptionGroup(scope, "RdsExampleOptionGroup", {
      engine,
      configurations: [{ name: "MARIADB_AUDIT_PLUGIN" }],
    }),
    parameterGroup: new ParameterGroup(scope, "RdsExampleParameterGroup", {
      engine,
      parameters: {
        character_set_database: "utf8mb4",
        character_set_server: "utf8mb4",
      },
    }),
  });
}
