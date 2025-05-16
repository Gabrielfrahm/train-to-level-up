resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda-exec-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_policy_attachment" "lambda_basic_execution" {
  name       = "lambda-basic-execution-attach"
  roles      = [aws_iam_role.lambda_exec_role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "create_auth_challenge" {
  function_name = "create-auth-challenge"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"

  filename         = "${path.module}/lambda_zips/createAuthChallenge.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda_zips/createAuthChallenge.zip")

  environment {
    variables = {
      GMAIL_USER     = var.gmail_user
      GMAIL_PASSWORD = var.gmail_password
    }
  }
}

resource "aws_lambda_function" "define_auth_challenge" {
  function_name = "define-auth-challenge"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"

  filename         = "${path.module}/lambda_zips/defineAuthChallenge.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda_zips/defineAuthChallenge.zip")
}

resource "aws_lambda_function" "verify_auth_challenge" {
  function_name = "verify-auth-challenge"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"

  filename         = "${path.module}/lambda_zips/verifyAuthChallenge.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda_zips/verifyAuthChallenge.zip")
}
