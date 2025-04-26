output "rds_endpoint" {
  description = "Endpoint RDS"
  value       = aws_db_instance.postgres.endpoint
}
