import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam'

interface IamRoleProps extends cdk.StackProps {
    name: string
    policy: iam.PolicyDocument
    identifier: string
}
export class IamRoleStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: IamRoleProps) {
        super(scope, id, props);

        const role = new iam.Role(this, `${id}Role`, {
            assumedBy: new iam.ServicePrincipal(props.identifier),

        })
        role.addToPolicy(
            new iam.PolicyStatement({
                resources: ["*"],
                actions: ["sts:AssumeRole"],
            })
        )

        const policy = new iam.Policy(this, `${id}Policy`, {
            document: props.policy
        })
    }
}

