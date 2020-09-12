resource "aws_instance" "example" {
  ami           = "ami-064c81ce3a290fde1"
  instance_type = "t3.micro"
  tags = {
    "Name" = "example"
  }
  user_data = <<EOF
  #!/bin/bash
  yum install -y httpd
  systemctl start httpd.service
EOF
}
