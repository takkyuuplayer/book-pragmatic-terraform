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

resource "aws_instance" "example" {
  ami           = data.aws_ami.recent_amazon_linux_2.image_id
  instance_type = local.example_instance_type
}

output "example_instance_id" {
  value = aws_instance.example.id
}