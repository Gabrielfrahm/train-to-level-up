resource "aws_ecs_cluster" "this" {
  name = "${var.prefix}-cluster"
}

resource "aws_iam_role" "ecs_task_execution" {
  name = "${var.prefix}-ecs-execution"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}


resource "aws_cloudwatch_log_group" "ecs_logs" {
  name              = "/ecs/${var.prefix}"
  retention_in_days = 1

  tags = {
    Name = "${var.prefix}-logs"
  }
}

resource "aws_ecs_task_definition" "app" {
  family                   = "${var.prefix}-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn

  container_definitions = jsonencode([
    {
      name      = "app"
      image     = var.image_uri
      essential = true
      portMappings = [
        {
          containerPort = 3333
          hostPort      = 3333
        }
      ]
      environment = [
        { name = "PORT", value = "3333" },
        { name = "NODE_ENV", value = "development" },
        { name = "DB_PORT", value = var.db_port },
        { name = "DB_USERNAME", value = var.db_username },
        { name = "DB_PASSWORD", value = var.db_password },
        { name = "DB_NAME", value = var.db_name }
      ],
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          awslogs-group         = "/ecs/${var.prefix}"
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
  depends_on = [aws_cloudwatch_log_group.ecs_logs]
}


resource "aws_ecs_service" "app" {
  name            = "${var.prefix}-service"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  # launch_type     = "FARGATE"

  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 1
  }

  network_configuration {
    subnets         = var.subnet_ids
    assign_public_ip = true
    security_groups = [var.security_group_id]
  }

  # load_balancer {
  #   target_group_arn = var.target_group_arn
  #   container_name   = "app"
  #   container_port   = 3333
  # }

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = "app"
    container_port   = 3333
  }

  depends_on = [aws_iam_role_policy_attachment.ecs_task_execution_policy]
}
