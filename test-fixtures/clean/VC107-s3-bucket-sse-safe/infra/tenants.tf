# One bucket per tenant, each with its own encryption config.
resource "aws_s3_bucket" "tenant" {
  for_each = toset(var.tenant_ids)
  bucket   = "acme-tenant-${each.key}"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "tenant" {
  for_each = aws_s3_bucket.tenant
  bucket   = each.value.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}
