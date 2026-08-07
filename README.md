# IBG Management API

API REST para gestão da Igreja Batista da Graça - IBG. O projeto centraliza dados da igreja, membros, ministérios, anúncios, eventos, campanhas de contribuição, inventário, estudos bíblicos e documentos.

## Tecnologias

- Node.js, Express e TypeScript
- PostgreSQL e Prisma ORM
- Zod para validação de requisições
- JWT para autenticação
- Swagger/OpenAPI para documentação
- Jest e Supertest para testes

## Requisitos

- Node.js 22 ou superior
- PostgreSQL 16 ou superior

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env` e ajuste a conexão com o banco de dados e os segredos JWT.

3. Crie/aplique as migrações e gere o cliente Prisma:

   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```

4. Inicie a API em desenvolvimento:

   ```bash
   npm run dev
   ```

A API usa a porta definida em `PORT` (5000 no arquivo de exemplo).

## Comandos principais

| Comando                   | Descrição                                    |
| ------------------------- | -------------------------------------------- |
| `npm run dev`             | Inicia a API em modo de desenvolvimento.     |
| `npm run build`           | Compila TypeScript para `dist/`.             |
| `npm start`               | Inicia a versão compilada.                   |
| `npm test`                | Executa os testes.                           |
| `npm run lint`            | Executa a análise estática.                  |
| `npm run prisma:migrate`  | Cria/aplica uma migração de desenvolvimento. |
| `npm run prisma:generate` | Gera o cliente Prisma.                       |
| `npm run prisma:studio`   | Abre o Prisma Studio.                        |
| `npm run prisma:pull`     | Traz os dados do banco para schema.prisma..  |

## Endpoints

Todas as rotas da aplicação têm o prefixo `/api/v1`.

| Recurso                   | Prefixo          |
| ------------------------- | ---------------- |
| Autenticação              | `/auth`          |
| Saúde da aplicação        | `/health`        |
| Configurações da igreja   | `/church`        |
| Membros                   | `/members`       |
| Ministérios               | `/ministries`    |
| Anúncios                  | `/announcements` |
| Eventos                   | `/events`        |
| Campanhas de contribuição | `/contributions` |
| Inventário                | `/inventory`     |
| Estudos bíblicos          | `/bible-studies` |
| Documentos                | `/documents`     |

A documentação interativa está disponível em `GET /api-docs`; o documento OpenAPI em JSON está em `GET /api-docs.json`.

## Formato das respostas

Respostas usam o formato abaixo. Mensagens e erros expostos pela API são fornecidos em português.

```json
{
  "success": true,
  "message": "Mensagem da operação",
  "data": {}
}
```

Em erros de validação, `errors` informa o campo e o motivo:

```json
{
  "success": false,
  "message": "Erro de validação",
  "errors": [{ "field": "body.email", "message": "E-mail inválido" }]
}
```
