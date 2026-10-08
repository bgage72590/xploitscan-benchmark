# Functions for the app backend.

# Generates thumbnails whenever a user uploads an image.
resource "aws_lambda_function" "image_resizer" {
  function_name    = "${var.project}-image-resizer"
  role             = aws_iam_role.lambda.arn
  runtime          = "nodejs20.x"
  handler          = "resize.handler"
  filename         = data.archive_file.resizer.output_path
  source_code_hash = data.archive_file.resizer.output_base64sha256
  memory_size      = 1024
  timeout          = 30

  vpc_config {
    subnet_ids         = var.private_subnet_ids
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      UPLOADS_BUCKET = var.uploads_bucket
      DATABASE_URL   = var.database_url
    }
  }
}

# REST API — talks to the Postgres instance in the private subnets.
resource "aws_lambda_function" "api" {
  function_name    = "${var.project}-api"
  role             = aws_iam_role.lambda.arn
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  filename         = data.archive_file.api.output_path
  source_code_hash = data.archive_file.api.output_base64sha256
  timeout          = 15

  vpc_config {
    subnet_ids         = var.private_subnet_ids
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      DATABASE_URL = var.database_url
    }
  }
}
