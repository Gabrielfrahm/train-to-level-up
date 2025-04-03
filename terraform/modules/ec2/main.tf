data "aws_ami" "latest-ami" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_iam_role" "ec2-role" {
  name = "${var.prefix}-ec2-profile"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_instance_profile" "ec2-profile" {
  name = "${var.prefix}-ec2-profile"
  role = aws_iam_role.ec2-role.name
}

resource "tls_private_key" "ec2-key" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "aws_key_pair" "ec2-key" {
  key_name   = "${var.prefix}-ec2-key"
  public_key = tls_private_key.ec2-key.public_key_openssh
}

output "ec2_private_key" {
  value     = tls_private_key.ec2-key.private_key_pem
  sensitive = true
}

resource "aws_launch_template" "ec2-lt" {
  name_prefix            = "${var.prefix}-ec2"
  image_id               = data.aws_ami.latest-ami.id
  instance_type          = "t2.micro"
  key_name = aws_key_pair.ec2-key.key_name
  vpc_security_group_ids = [var.security_group_id]
  iam_instance_profile {
    name = aws_iam_instance_profile.ec2-profile.name
  }
  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "${var.prefix}-ec2-instance"
    }
  }
  user_data = filebase64("${path.module}/user_data.sh")
}


resource "aws_autoscaling_group" "asg" {
  vpc_zone_identifier = var.subnet_ids
  desired_capacity = var.desired_size
  max_size         = var.max_size
  min_size         = var.min_size
  launch_template {
    id = aws_launch_template.ec2-lt.id
    version = "$Latest"
  }

  tag {
    key                 = "AmazonECSManaged"
    value               = true
    propagate_at_launch = true
  }
}

resource "aws_alb" "ec2-alb" {
  name            = "${var.prefix}-ec2-alb"
  internal        = false
  load_balancer_type = "application"
  security_groups = [var.security_group_id]
  subnets         = var.subnet_ids

  tags = {
    Name = "${var.prefix}-ec2-alb"
  }
}

resource "aws_lb_target_group" "ec2-tg" {
  name = "${var.prefix}-ec2-tg"
  port = 3333
  protocol = "HTTP"
  vpc_id = var.vpc_id
  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold  = 2
    unhealthy_threshold = 2
  }
  tags = {
    Name = "${var.prefix}-ec2-tg"
  }
}


resource "aws_lb_listener" "ec2-listener" {
  load_balancer_arn = aws_alb.ec2-alb.arn
  port              = 3333
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ec2-tg.arn
  }
}
