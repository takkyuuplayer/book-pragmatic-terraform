# Private Bucket
resource "aws_s3_bucket" "private" {
    bucket = "tp-private-pragmatic-terraform"
    versioning {
        enabled = true
    }
    server_side_encryption_configuration {
        rule {
            apply_server_side_encryption_by_default {
                sse_algorithm = "AES256"
            }
        }
    }
}

resource "aws_s3_bucket_public_access_block" "private" {
    bucket = aws_s3_bucket.private.id
    block_public_acls = true
    block_public_policy = true
    ignore_public_acls = true
    restrict_public_buckets = true
}

# Public Bucket

resource "aws_s3_bucket" "public" {
    bucket = "tp-public-progmatic-terraform"
    acl = "public-read"

    cors_rule {
        allowed_origins = ["https://example.com"]
        allowed_methods = ["GET"]
        allowed_headers = ["*"]
        max_age_seconds = 3000
    }
}

# Log Bucket

resource "aws_s3_bucket" "alb_log" {
    bucket = "tp-alb-log-progmatic-terraform"
    lifecycle_rule {
        enabled = true

        expiration {
            days = "180"
        }
    }
}

resource "aws_s3_bucket_policy" "alb_log" {
    bucket = aws_s3_bucket.alb_log.id
    policy = data.aws_iam_policy_document.alb_log.json
}

data "aws_iam_policy_document" "alb_log" {
    statement {
        effect = "Allow"
        actions = ["s3:PutObject"]
        resources = ["arn:aws:s3:::${aws_s3_bucket.alb_log.id}/*"]

        principals {
            type = "AWS"
            identifiers = ["582318560864"]
        }
    }
}

# Force Destroyable Bucket

resource "aws_s3_bucket" "force_destroy" {
    bucket = "tp-force-destroy-pragmatic-terraform"
    force_destroy = true
}