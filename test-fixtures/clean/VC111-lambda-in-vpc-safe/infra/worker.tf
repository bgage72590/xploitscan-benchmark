# Queue worker. Runs inside the VPC wherever private subnets exist; the
# preview environment has none, so the block is generated per environment.
resource "aws_lambda_function" "queue-worker" {
  function_name = "${var.project}-queue-worker"
  role          = aws_iam_role.lambda.arn
  runtime       = "python3.12"
  handler       = "worker.handler"
  filename      = data.archive_file.worker.output_path
  timeout       = 60

  dynamic "vpc_config" {
    for_each = length(var.private_subnet_ids) > 0 ? [1] : []
    content {
      subnet_ids         = var.private_subnet_ids
      security_group_ids = [aws_security_group.lambda.id]
    }
  }
}
