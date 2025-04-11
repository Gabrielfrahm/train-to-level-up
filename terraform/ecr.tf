# resource "aws_ecr_repository" "app" {
#   name = var.prefix

#   image_scanning_configuration {
#     scan_on_push = true
#   }

#   tags = {
#     Name = "${var.prefix}-ecr"
#   }
# }
