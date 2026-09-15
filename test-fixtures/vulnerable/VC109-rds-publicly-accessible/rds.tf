# Terraform definition of the primary Postgres database.
# This should trigger VC109 (RDS Instance Publicly Accessible).

resource "aws_db_instance" "primary" {
  identifier             = "app-primary"
  engine                 = "postgres"
  engine_version         = "15.5"
  instance_class         = "db.t3.medium"
  allocated_storage      = 50
  db_name                = "appdb"
  username               = "appuser"
  password               = var.db_password
  vpc_security_group_ids = [aws_security_group.db.id]

  # Left on so the dashboard on the laptop can connect directly.
  publicly_accessible = true

  skip_final_snapshot = true
}
