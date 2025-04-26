resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "${var.prefix}-rds-subnet-group"
  subnet_ids = module.new-vpc.subnet_ids

  tags = {
    Name = "${var.prefix}-rds-subnet-group"
  }
}

resource "aws_db_instance" "postgres" {
  identifier             = "${var.prefix}-postgres-db"
  engine                 = "postgres"
  engine_version         = "15.2"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  storage_type           = "gp2"

  username               = var.db_username
  password               = var.db_password
  db_name                = var.db_name

  publicly_accessible    = true
  skip_final_snapshot    = true
  deletion_protection    = false
  multi_az               = false
  backup_retention_period = 0

  vpc_security_group_ids = [module.new-vpc.rds_security_group_id]
  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name

  tags = {
    Name = "${var.prefix}-postgres-db"
  }
}
