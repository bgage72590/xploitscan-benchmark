# Reusable bucket module (provider v3 style): encryption is on unless the
# caller passes an empty config.
resource "aws_s3_bucket" "this" {
  count  = var.create_bucket ? 1 : 0
  bucket = var.bucket
  tags   = var.tags

  dynamic "server_side_encryption_configuration" {
    for_each = length(keys(var.server_side_encryption_configuration)) == 0 ? [] : [var.server_side_encryption_configuration]

    content {
      dynamic "rule" {
        for_each = [lookup(server_side_encryption_configuration.value, "rule", {})]

        content {
          apply_server_side_encryption_by_default {
            sse_algorithm     = lookup(rule.value, "sse_algorithm", "aws:kms")
            kms_master_key_id = lookup(rule.value, "kms_master_key_id", null)
          }
        }
      }
    }
  }
}
