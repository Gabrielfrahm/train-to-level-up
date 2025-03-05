# train-to-level-up

[descrever algo]

## Big Picture

![fluxo](/train%20to%20level%20up.jpeg)

## Login flow

```mermaid
sequenceDiagram
    participant Cliente
    participant Cognito as Amazon Cognito
    participant SES as Amazon simple email service (SES)
    participant API as API Gateway / Fargate

    Cliente->>Cognito:  Login com email
    Cognito->>SES:  Retorna código de verificação
    SES-->>Cliente: Envia o código de acesso via e-mail.
    Cliente->>Cognito:  Insere código recebido
    Cognito-->>API:  Retorna token JWT
```
