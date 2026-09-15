# Terraform security group for the application tier.
# This should trigger VC108 (Security Group Allows All Inbound).

resource "aws_security_group" "app_tier" {
  name        = "app-tier-sg"
  description = "Application tier security group"
  vpc_id      = var.vpc_id

  ingress {
    description = "Temporary open rule so the team can reach the box"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "app-tier-sg"
  }
}
