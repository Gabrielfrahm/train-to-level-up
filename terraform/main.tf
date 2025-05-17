terraform {
  required_version = ">=1.5.7"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    local = ">=2.1.0"
  }
  backend "s3" {
    bucket = "train-to-level-up-tfstate"
    key    = "terraform/ecs.tfstate"
    region = "us-east-1"
    encrypt = true
  }
}

provider "aws" {
  region     = var.aws_region
}

module "new-vpc" {
  source         = "./modules/vpc"
  prefix         = var.prefix
  vpc_cidr_block = var.vpc_cidr_block
}

module "ecs" {
  source            = "./modules/ecs"
  prefix            = var.prefix
  security_group_id = module.new-vpc.security_group_id
  subnet_ids        = module.new-vpc.subnet_ids
  desired_size      = var.desired_size
  max_size          = var.max_size
  min_size          = var.min_size
  vpc_id            = module.new-vpc.vpc_id
  aws_region        = var.aws_region
  image_uri         = var.image_uri
  target_group_arn  = aws_lb_target_group.ecs_target_group.arn
  db_username       = var.db_username
  db_password       = var.db_password
  db_name           = var.db_name
  db_host           = aws_db_instance.rds_postgres.address
  cognito_user_pool_id = aws_cognito_user_pool.main.id
  cognito_user_pool_client_id = aws_cognito_user_pool_client.app_client.id
}
