locals  {
  example_instance_type = "t3.micro"
}

resource "aws_instance" "example" {
  ami           = "ami-064c81ce3a290fde1"
  instance_type = local.example_instance_type
}

output "example_instance_id" {
  value = aws_instance.example.id
}