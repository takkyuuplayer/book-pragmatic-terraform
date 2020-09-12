provider "aws" {
  region = "ap-northeast-2"
}
data "aws_ami" "recent_amazon_linux_2" {
  most_recent = true
  owners = ["amazon"]

  filter {
    name = "name"
    values = ["amzn2-ami-hvm-2.0.????????-x86_64-gp2"]
  }
  filter {
    name = "state"
    values = ["available"]
  }
}
locals  {
  example_instance_type = "t3.micro"
}

resource "aws_security_group" "example_ec2" {
  name = "example-ec2"
  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "example" {
  ami           = data.aws_ami.recent_amazon_linux_2.image_id
  instance_type = local.example_instance_type
  vpc_security_group_ids = [
    aws_security_group.example_ec2.id
  ]
  user_data = <<EOF
  #!/bin/bash
  yum install -y httpd
  systemctl start httpd.service
  EOF
}

output "example_instance_id" {
  value = aws_instance.example.id
}

output "example_public_dns" {
  value = aws_instance.example.public_dns
}