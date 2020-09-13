data "aws_route53_zone" "example" {
    name = "takkyuuplayer.com"
}

resource "aws_route53_record" "example" {
    zone_id = data.aws_route53_zone.example.zone_id
    name = "terraform.${data.aws_route53_zone.example.name}"
    type = "A"

    alias {
        name = aws_lb.example.dns_name
        zone_id = aws_lb.example.zone_id
        evaluate_target_health = true
    }
}

output "domain_name" {
    value = aws_route53_record.example.name
}

# Chap8.4 ACM
resource "aws_acm_certificate" "example" {
  domain_name               = data.aws_route53_zone.example.name
  subject_alternative_names = []
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/guides/version-3-upgrade#resource-aws_acm_certificate
resource "aws_route53_record" "example_certificate" {
  for_each = {
    for dvo in aws_acm_certificate.example.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.example.zone_id
}

resource "aws_acm_certificate_validation" "example" {
  certificate_arn         = aws_acm_certificate.example.arn
  validation_record_fqdns = [for record in aws_route53_record.example_certificate : record.fqdn]
}
