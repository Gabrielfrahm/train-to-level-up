variable "prefix" {}
variable "security_group_id" {}
variable "subnet_ids" {}
variable "desired_size" {}
variable "max_size" {}
variable "min_size" {}
variable "vpc_id" {}
variable "aws_region" {}
variable "image_uri" {}
variable "target_group_arn" {}
variable "db_username" {}
variable "db_password" {}
variable "db_name" {}
variable "db_port" {
  default = "5432"
}
variable "db_host" {}
