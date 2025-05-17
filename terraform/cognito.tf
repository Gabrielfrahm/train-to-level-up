

resource "aws_cognito_user_pool" "main" {
  name = "${var.prefix}-user-pool"

  auto_verified_attributes = ["email"]
  username_attributes      = ["email"]

  lambda_config {
    create_auth_challenge          = aws_lambda_function.create_auth_challenge.arn
    define_auth_challenge          = aws_lambda_function.define_auth_challenge.arn
    verify_auth_challenge_response = aws_lambda_function.verify_auth_challenge.arn
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }
}

resource "aws_cognito_user_pool_client" "app_client" {
  name         = "${var.prefix}-user-client"
  user_pool_id = aws_cognito_user_pool.main.id

  generate_secret                 = false
  explicit_auth_flows            = ["ALLOW_CUSTOM_AUTH", "ALLOW_USER_SRP_AUTH"]
  prevent_user_existence_errors  = "ENABLED"
  supported_identity_providers   = ["COGNITO"]
  callback_urls                  = ["http://localhost:3000"]
  logout_urls                    = ["http://localhost:3000"]
}

resource "aws_lambda_permission" "allow_cognito_create_auth" {
  statement_id  = "AllowExecutionFromCognitoCreate"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_auth_challenge.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.main.arn
}

resource "aws_lambda_permission" "allow_cognito_define_auth" {
  statement_id  = "AllowExecutionFromCognitoDefine"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.define_auth_challenge.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.main.arn
}

resource "aws_lambda_permission" "allow_cognito_verify_auth" {
  statement_id  = "AllowExecutionFromCognitoVerify"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.verify_auth_challenge.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.main.arn
}

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.main.id
}

output "cognito_user_pool_client_id" {
  value = aws_cognito_user_pool_client.app_client.id
}
