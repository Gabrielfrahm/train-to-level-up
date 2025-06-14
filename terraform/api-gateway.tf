# resource "aws_api_gateway_rest_api" "api" {
#   name = "${var.prefix}-gateway"
# }

# resource "aws_api_gateway_resource" "proxy" {
#   rest_api_id = aws_api_gateway_rest_api.api.id
#   parent_id   = aws_api_gateway_rest_api.api.root_resource_id
#   path_part   = "{proxy+}"
# }

# resource "aws_api_gateway_method" "proxy_method" {
#   rest_api_id   = aws_api_gateway_rest_api.api.id
#   resource_id   = aws_api_gateway_resource.proxy.id
#   http_method   = "ANY"
#   authorization = "NONE"

#   request_parameters = {
#     "method.request.path.proxy" = true
#   }
# }

# resource "aws_api_gateway_integration" "proxy_integration" {
#   rest_api_id             = aws_api_gateway_rest_api.api.id
#   resource_id             = aws_api_gateway_resource.proxy.id
#   http_method             = aws_api_gateway_method.proxy_method.http_method
#   integration_http_method = "ANY"
#   type                    = "HTTP"
#   uri                     = "http://${aws_lb.nlb.dns_name}:3333/{proxy}"
#   passthrough_behavior    = "WHEN_NO_MATCH"

#   request_parameters = {
#     "integration.request.path.proxy" = "method.request.path.proxy"
#   }
# }

# resource "aws_api_gateway_deployment" "deploy" {
#   depends_on  = [aws_api_gateway_integration.proxy_integration]
#   rest_api_id = aws_api_gateway_rest_api.api.id
# }

# resource "aws_api_gateway_stage" "stage" {
#   deployment_id = aws_api_gateway_deployment.deploy.id
#   rest_api_id   = aws_api_gateway_rest_api.api.id
#   stage_name    = "prod"
# }


resource "aws_apigatewayv2_api" "http_api" {
  name          = "${var.prefix}-http-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_vpc_link" "vpc_link" {
  name               = "${var.prefix}-vpc-link"
  security_group_ids = [module.new-vpc.security_group_id]
  subnet_ids         = module.new-vpc.private_subnet_ids
}

resource "aws_apigatewayv2_integration" "nlb_integration" {
  api_id             = aws_apigatewayv2_api.http_api.id
  integration_type   = "HTTP_PROXY"
  integration_uri    = "http://${aws_lb.nlb.dns_name}"
  integration_method = "ANY"
  connection_type    = "VPC_LINK"
  connection_id      = aws_apigatewayv2_vpc_link.vpc_link.id
}

resource "aws_apigatewayv2_route" "proxy_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.nlb_integration.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

output "http_api_endpoint" {
  value = aws_apigatewayv2_api.http_api.api_endpoint
  description = "URL de entrada pública via API Gateway HTTP API v2"
}
