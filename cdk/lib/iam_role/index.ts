import * as iam from "@aws-cdk/aws-iam";
import { Policy, Role } from "@aws-cdk/aws-iam";
import * as cdk from "@aws-cdk/core";

interface IamRoleProps {
  name: string;
  policy: iam.PolicyDocument;
  identifier: string;
}

export function IamRoleStack(
  scope: cdk.Construct,
  id: string,
  props: IamRoleProps
): {
  role: Role;
  policy: Policy;
} {
  const role = new iam.Role(scope, `${id}Role`, {
    assumedBy: new iam.ServicePrincipal(props.identifier),
  });

  const policy = new iam.Policy(scope, `${id}Policy`, {
    document: props.policy,
  });
  policy.attachToRole(role);

  return { role, policy };
}
