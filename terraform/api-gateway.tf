
resource "aws_apigatewayv2_api" "http_api" {
  name          = "${var.prefix}-http-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_vpc_link" "ecs_link" {
  name               = "${var.prefix}-vpc-link"
  subnet_ids         = var.public_subnets # ou subnets privadas se preferir
  security_group_ids = [var.api_gw_sg_id] # se necessário (geralmente não obrigatório com NLB)
}

resource "aws_apigatewayv2_integration" "ecs_integration" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "HTTP_PROXY"
  connection_type        = "VPC_LINK"
  connection_id          = aws_apigatewayv2_vpc_link.ecs_link.id
  integration_method     = "ANY"
  integration_uri        = "http://${aws_lb.nlb.dns_name}:3333"
  payload_format_version = "1.0"
}

resource "aws_apigatewayv2_route" "root_proxy" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.ecs_integration.id}"
}

resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "prod"
  auto_deploy = true
}
