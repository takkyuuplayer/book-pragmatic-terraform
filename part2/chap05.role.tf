data "aws_iam_policy_document" "ec2_assume_role" {
    statement {
        actions = ["sts:AssumeRole"]
        principals {
            type = "Service"
            identifiers = ["ec2.amazonaws.com"]
        }
    }

}

resource "aws_iam_role" "example" {
    name = "example"
    assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json

}

resource "aws_iam_role_policy_attachment" "example" {
    role = aws_iam_role.example.name
    policy_arn = aws_iam_policy.example.arn
}