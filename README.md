# train-to-level-up


## Login flow
```mermaid
sequenceDiagram
    participant Cliente
    participant Cognito as Amazon Cognito
    participant API as API Gateway / Fargate

    Cliente->>Cognito:  Login com email
    Cognito-->>Cliente:  Retorna código de verificação
    Cliente->>Cognito:  Insere código recebido
    Cognito-->>API:  Retorna token JWT
```