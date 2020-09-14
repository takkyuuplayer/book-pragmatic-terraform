resource "aws_ssm_parameter" "db_username" {
    name = "/db/username"
    value = "root"
    type = "String"
    description = "username for DB"
}

resource "aws_ssm_parameter" "db_raw_password" {
    name = "/db/raw_password"
    value = "uninitialized"
    type = "SecureString"
    description = "password for DB"

    lifecycle {
        ignore_changes = [value]
    }
}