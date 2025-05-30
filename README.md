# train-to-level-up

[descrever algo]

## Big Picture

![fluxo](/train%20to%20level%20up.jpeg)

## Cadastro

```mermaid
sequenceDiagram
    participant Cliente
    participant Fargate as ESC Fargate
    participant Cognito as Amazon Cognito
    participant SES as Amazon simple email service (SES)

    Cliente->>Fargate:  Informações de cadastro
    Fargate->>Cognito: Recebe as informações do Cadastro
    Cognito->>SES: Envia codigo de confirmação de E-mail
    SES-->>Cliente: Envia para o cliente a confirmação de E-mail
    Cliente->>Cliente: Realiza a confirmação de e-mail.
    note left of Cliente: Apos realiza confirmação de e-mail <br/> o Cliente podera fazer o login.
```

## Login

```mermaid
sequenceDiagram
    participant Cliente
    participant Cognito as Amazon Cognito
    participant SES as Amazon simple email service (SES)
    participant API as API Gateway / Fargate

    Cliente->>Cognito:  Login com email
    Cognito->>SES:  Envia código de verificação
    SES-->>Cliente: Envia o código de acesso via e-mail.
    Cliente->>Cognito:  Insere código recebido
    Cognito-->>API:  Retorna token JWT
```

##

## Bounded Contexts
### Training context
- Escopo: Tudo que envolve criacao, registro, validacao de sessoes de treino
- Principais resposabilidades
  - Catalago de exercicios
  - composicao de treino
  - registro de sessaoe garatir que seja 1 treino por dia
  - emitir evento como `workoutCompleted` e `workoutSession`

### Gamification Context
- Escopo: Converter treino em progresso de `Game`.
- Principais responsabilidades
  - calculo de XP a partir de sessoes de treino concluidas
  - regras de level up e evolucao do user
  - geracao de batalhas com inimigos
  -  emitir evento como `EnemyBattle`, `LevelUp`, `XPGranted`

### Battle Context
- Escopo: Logica de combate estilo RPG entre usuario e inimigos
- Principais Responsabilidades:
  - calculo de Dano, HP
  - Turnos de ataques, defesa
  - resultado do combate
  - emitir eventos como `EnemyDefeated` ou `UserDefeated`
  (pode ser um subdominio de Gamification)

### Auth Context
- Escopo: Autenticacao e gerenciamento de usuario
- Principais responsabilidades
  - Cadastro, login, tokens (cognito)
  - Tradução de sub Cognito ⇄ UserId de domínio
  - ACL e Anti-Corruption Layer do Cognito


### Notification Context
- Escopo: Envio de notificacao a partir dos eventos do dominio
- Principais Responsabilidades
  - assinar eventos de dominio
  - dispara emails
  - template de mensagens e regras de disparo.


### Media Context
- Escopo: Gestao de sprites e imagens
- Principais responsabilidades
  - Gerenciamento de imagens no S3
  - Geracao de urls assinadas do S3
  - Versonamento de Sprites


### Bounded Context Map
![alt text](bounded-context-map.png)

