resource "aws_api_gateway_rest_api" "api" {
  name = "${var.prefix}-gateway"
}

resource "aws_api_gateway_method" "root_method" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_rest_api.api.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "alb_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_rest_api.api.root_resource_id
  http_method             = aws_api_gateway_method.root_method.http_method
  integration_http_method = "ANY"
  type                    = "HTTP"
  uri                     = "http://${aws_lb.app.dns_name}/"
}

resource "aws_api_gateway_deployment" "deploy" {
  depends_on = [aws_api_gateway_integration.alb_integration]

  rest_api_id = aws_api_gateway_rest_api.api.id
}
