# Chap 15.2 Instance Profile

data "aws_iam_policy_document" "ec2_for_ssm" {
    source_json = data.aws_iam_policy.ec2_for_ssm.policy
    statement {
        effect = "Allow"
        resources = ["*"]
        actions = [
            "s3:PutObject",
            "logs:PutLogEvents",
            "logs:CreateLogStream",
            "ecr:GetAuthorizationToken",
            "ecr:BatchCheckLayerAvailability",
            "ecr:GetDownloadUrlForLayer",
            "ecr:BatchGetImage",
            "ssm:GetParameter",
            "ssm:GetParameters",
            "ssm:GetParametersByPath",
            "kms:Decript"
        ]
    }
}

data "aws_iam_policy" "ec2_for_ssm" {
    arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

module "ec2_for_ssm_role" {
    source = "./iam_role"
    name = "ec2-for-ssm"
    identifier = "ec2.amazonaws.com"
    policy = data.aws_iam_policy_document.ec2_for_ssm.json
}

resource "aws_iam_instance_profile" "ec2_for_ssm" {
    name = "ec2-for-ssm"
    role = module.ec2_for_ssm_role.iam_role_name
}

resource "aws_instance" "example_for_operation" {
  ami                  = "ami-0f9ae750e8274075b"
  instance_type        = "t3.micro"
  iam_instance_profile = aws_iam_instance_profile.ec2_for_ssm.name
  subnet_id            = aws_subnet.private_0.id
  user_data            = file("./user_data.sh")
}

output "operation_instance_id" {
  value = aws_instance.example_for_operation.id
}

resource "aws_s3_bucket" "operation" {
    bucket = "tp-operation-pragmatic-terraform"
    lifecycle_rule {
        enabled = true
        expiration {
            days = "180"
        }
    }
}

resource "aws_cloudwatch_log_group" "operation" {
    name = "/operation"
    retention_in_days = 180
}

resource "aws_ssm_document" "session_manager_run_shell" {
    name = "SSM-SessionManagerRunShell"
    document_type = "Session"
    document_format = "JSON"

    content = <<EOF
{
    "schemaVersion": "1.0",
    "description": "Document to hold regional settings for Sesion Manager",
    "sessionType": "Standard_Stream",
    "inputs": {
        "s3BucketName": "${aws_s3_bucket.operation.id}",
        "cloudWatchLogGroupName": "${aws_cloudwatch_log_group.operation.name}"
    }
}
EOF

}