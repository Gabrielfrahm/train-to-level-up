resource "aws_api_gateway_vpc_link" "ecs_link" {
  name        = "${var.prefix}-vpc-link"
  target_arns = [aws_lb.nlb.arn]
}

resource "aws_api_gateway_rest_api" "api" {
  name = "${var.prefix}-gateway"
}

resource "aws_api_gateway_method" "root_method" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_rest_api.api.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "nlb_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_rest_api.api.root_resource_id
  http_method             = aws_api_gateway_method.root_method.http_method
  integration_http_method = "ANY"
  type                    = "HTTP"
  uri                     = "http://${aws_lb.nlb.dns_name}:3333/"
  connection_type         = "VPC_LINK"
  connection_id           = aws_api_gateway_vpc_link.ecs_link.id
}

resource "aws_api_gateway_deployment" "deploy" {
  depends_on = [aws_api_gateway_integration.nlb_integration]

  rest_api_id = aws_api_gateway_rest_api.api.id
}
