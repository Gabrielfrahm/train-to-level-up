
resource "aws_apigatewayv2_api" "http_api" {
  name          = "${var.prefix}-http-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_vpc_link" "ecs_link" {
  name               = "${var.prefix}-vpc-link"
  subnet_ids         =  module.new-vpc.subnet_ids
  security_group_ids = [module.new-vpc.security_group_id]
}

resource "aws_apigatewayv2_integration" "ecs_integration" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "HTTP_PROXY"
  connection_type        = "VPC_LINK"
  connection_id          = aws_apigatewayv2_vpc_link.ecs_link.id
  integration_method     = "ANY"
  integration_uri        = aws_lb_listener.nlb_listener.arn
  payload_format_version = "1.0"
}

resource "aws_apigatewayv2_route" "root_proxy" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.ecs_integration.id}"
}

resource "aws_apigatewayv2_stage" "dev" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "dev"
  auto_deploy = true
}
