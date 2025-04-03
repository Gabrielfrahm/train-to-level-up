terraform {
  required_version = ">=1.5.7"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    local = ">=2.1.0"
  }
}

provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = var.aws_region
}

module "new-vpc" {
  source         = "./modules/vpc"
  prefix         = var.prefix
  vpc_cidr_block = var.vpc_cidr_block
}

module "ec2" {
  source            = "./modules/ec2"
  prefix            = var.prefix
  security_group_id = module.new-vpc.security_group_id
  subnet_ids        = module.new-vpc.subnet_ids
  desired_size      = var.desired_size
  max_size          = var.max_size
  min_size          = var.min_size
  vpc_id            = module.new-vpc.vpc_id
}
