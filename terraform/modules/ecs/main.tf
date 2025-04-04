# ECR Repository
resource "aws_ecr_repository" "api-repo" {
  name = "${var.prefix}-api-repo"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.prefix}-api-repo"
  }
}

output "ecr_repository_url" {
  value = aws_ecr_repository.api-repo.repository_url
}

# Docker Push
resource "null_resource" "docker-push" {
  provisioner "local-exec" {
    environment = {
      AWS_ACCESS_KEY_ID     = var.aws_access_key
      AWS_SECRET_ACCESS_KEY = var.aws_secret_key
      AWS_REGION            = var.aws_region
    }

    command = <<EOT
      # Obter a URL do repositório ECR
      ECR_URL=$(aws ecr describe-repositories --repository-names ${var.prefix}-api-repo --region $AWS_REGION --query "repositories[0].repositoryUri" --output text)

      # Fazer login no ECR
      aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URL

      # Build da imagem Docker para a plataforma linux/amd64
      docker build --platform linux/amd64 -t api-image /Users/IN58SCV/study/train-to-level-up

      # Tag da imagem
      docker tag api-image:latest $ECR_URL:latest

      # Push da imagem para o ECR
      docker push $ECR_URL:latest
    EOT
  }

  depends_on = [aws_ecr_repository.api-repo]
}

# ECS Cluster
resource "aws_ecs_cluster" "api-cluster" {
  name = "${var.prefix}-api-cluster"
}

# IAM Role e Policy
resource "aws_iam_role" "ecs-task-execution-role" {
  name = "${var.prefix}-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "ecs-task-execution-policy" {
  name       = "${var.prefix}-ecs-task-execution-policy"
  roles      = [aws_iam_role.ecs-task-execution-role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Task Definition
resource "aws_ecs_task_definition" "api-task" {
  family                   = "${var.prefix}-api-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs-task-execution-role.arn

  container_definitions = jsonencode([
    {
      name      = "api-container"
      image     = "${aws_ecr_repository.api-repo.repository_url}:latest"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 3333
          hostPort      = 3333
          protocol      = "tcp"
        }
      ]
    }
  ])
}

# ALB (Application Load Balancer)
resource "aws_alb" "api-alb" {
  name               = "${var.prefix}-api-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.security_group_id]
  subnets            = var.subnet_ids

  tags = {
    Name = "${var.prefix}-api-alb"
  }
}

# Target Group
resource "aws_lb_target_group" "api-tg" {
  name         = "${var.prefix}-api-tg"
  port         = 3333
  protocol     = "HTTP"
  vpc_id       = var.vpc_id
  target_type  = "ip"

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }

  tags = {
    Name = "${var.prefix}-api-tg"
  }
}

# Listener
resource "aws_lb_listener" "api-listener" {
  load_balancer_arn = aws_alb.api-alb.arn
  port              = 3333
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api-tg.arn
  }
}

# ECS Service
resource "aws_ecs_service" "api-service" {
  name            = "${var.prefix}-api-service"
  cluster         = aws_ecs_cluster.api-cluster.id
  task_definition = aws_ecs_task_definition.api-task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.subnet_ids
    security_groups = [var.security_group_id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api-tg.arn
    container_name   = "api-container"
    container_port   = 3333
  }

  depends_on = [aws_lb_listener.api-listener]
}
