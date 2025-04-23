
# resource "aws_lb" "app" {
#   name               = "${var.prefix}-alb"
#   internal           = false
#   load_balancer_type = "application"
#   subnets            = module.new-vpc.subnet_ids
#   security_groups    = [module.new-vpc.security_group_id]

#   tags = {
#     Name = "${var.prefix}-alb"
#   }
# }

# resource "aws_lb_target_group" "app" {
#   name        = "${var.prefix}-tg"
#   port        = 3333
#   protocol    = "HTTP"
#   vpc_id      = module.new-vpc.vpc_id
#   target_type = "ip"

#   health_check {
#     path                = "/"
#     interval            = 30
#     timeout             = 5
#     healthy_threshold   = 2
#     unhealthy_threshold = 2
#     matcher             = "200"
#   }
# }

# resource "aws_lb_listener" "http" {
#   load_balancer_arn = aws_lb.app.arn
#   port              = 80
#   protocol          = "HTTP"

#   default_action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.app.arn
#   }
# }

resource "aws_lb" "nlb" {
  name               = "${var.prefix}-nlb"
  internal           = false
  load_balancer_type = "network"
  subnets            = var.public_subnets
}

resource "aws_lb_target_group" "ecs_target_group" {
  name        = "${var.prefix}-tg"
  port        = 3333
  protocol    = "TCP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    protocol = "TCP"
  }
}

resource "aws_lb_listener" "nlb_listener" {
  load_balancer_arn = aws_lb.nlb.arn
  port              = 3333
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_target_group.arn
  }
}
