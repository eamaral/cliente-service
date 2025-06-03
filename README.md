# 👤 Cliente Service

Este microsserviço é responsável por gerenciar **clientes** do sistema da lanchonete: cadastro, autenticação via Cognito, recuperação de informações e atualização de pontos por fidelidade.

> Arquitetura baseada em **Clean Architecture**, separando responsabilidades de domínio, casos de uso, camadas de interface e infraestrutura.

---

## 📊 SonarCloud

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=eamaral_cliente-service&metric=alert_status)](https://sonarcloud.io/dashboard?id=eamaral_cliente-service)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=eamaral_cliente-service&metric=coverage)](https://sonarcloud.io/dashboard?id=eamaral_cliente-service)
[![Maintainability](https://sonarcloud.io/api/project_badges/measure?project=eamaral_cliente-service&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=eamaral_cliente-service)

---

## ⚙️ Tecnologias Utilizadas

- Node.js + Express
- AWS Cognito (auth)
- MySQL (RDS)
- Docker
- JWT (Bearer Token)
- Swagger para documentação
- Sequelize (ORM)

---

## 🔗 Rotas Principais

| Método | Rota                           | Descrição                                      |
|--------|--------------------------------|------------------------------------------------|
| POST   | `/api/clientes/register`       | Cadastra novo cliente com integração Cognito   |
| POST   | `/api/clientes/login`          | Login com autenticação Cognito                 |
| PUT    | `/api/clientes/:cpf`           | Atualiza pontos de fidelidade do cliente       |
| GET    | `/api/clientes/:cpf`           | Busca dados de um cliente por CPF              |
| GET    | `/health`                      | Health check                                   |

> Swagger disponível em `/cliente-docs`.

---

## 🚀 Executando localmente

```bash
git clone https://github.com/seu-usuario/cliente-service.git
cd cliente-service
cp .env.example .env
# Preencha variáveis do Cognito e banco MySQL
docker-compose up --build
```

---

## 🛠️ Observações

- Usa Cognito para login/registro com JWT, garantindo autenticação segura.
- Persistência dos dados em **RDS MySQL**.
- Atualização dos pontos de clientes ocorre após o pagamento (via integração entre serviços).
- Comunicação REST com os demais microsserviços.

---

## 🧪 Testes

- Casos de uso possuem testes unitários com Jest.
- Integração com SonarCloud para manter **coverage mínimo de 80%**.
- Cobertura focada em `usecases/`.

---

## 🧩 Clean Architecture

Estrutura por camadas com as seguintes pastas principais:

- `domain/`: entidades e contratos
- `usecases/`: regras de negócio
- `interfaces/http/`: controllers e rotas
- `infrastructure/`: repositórios e serviços externos (como Cognito)
- `config/`: env, banco, swagger, etc.

---

## 📦 CI/CD

- GitHub Actions com pipeline de build, push da imagem para ECR e deploy automático via Terraform.
- Infraestrutura como código (IaC) com ECS Fargate, VPC e RDS via Terraform.

---

## 📄 Licença

Projeto acadêmico para fins de demonstração.
