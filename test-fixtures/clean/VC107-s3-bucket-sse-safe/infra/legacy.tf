# Created before the provider v4 upgrade; its encryption now lives in
# legacy_encryption.tf, so Terraform must not try to manage it here.
resource "aws_s3_bucket" "legacy_uploads" {
  bucket = "acme-legacy-uploads"

  lifecycle {
    ignore_changes = [server_side_encryption_configuration]
  }
}
