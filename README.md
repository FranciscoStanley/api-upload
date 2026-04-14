# api-upload

[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![Tests](https://img.shields.io/badge/tests-16%20passing-brightgreen)](#testes)
[![Lint](https://img.shields.io/badge/lint-eslint-4B32C3?logo=eslint&logoColor=white)](#qualidade-de-codigo)
[![Format](https://img.shields.io/badge/format-prettier-F7B93E?logo=prettier&logoColor=1A2B34)](#qualidade-de-codigo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Projeto educacional para ensinar como construir uma API profissional com Node.js e Express, com foco pratico em upload de arquivos usando Multer.

O projeto evolui do básico para uma estrutura mais madura, incluindo validação de payload, tratamento global de erros, documentação OpenAPI, testes automatizados e padronização de código.

## Indice

- [Visao Geral](#visao-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Arquitetura em Camadas](#arquitetura-em-camadas)
- [Responsabilidade Arquivo por Arquivo](#responsabilidade-arquivo-por-arquivo)
- [Fluxo de Upload com Multer](#fluxo-de-upload-com-multer)
- [Como Executar](#como-executar)
- [Variaveis de Ambiente](#variaveis-de-ambiente)
- [Documentacao da API](#documentacao-da-api)
- [Endpoints](#endpoints)
- [Exemplos de Requisicao](#exemplos-de-requisicao)
- [Validacoes e Regras](#validacoes-e-regras)
- [Testes](#testes)
- [Qualidade de Codigo](#qualidade-de-codigo)
- [Boas Praticas de Commit](#boas-praticas-de-commit)
- [Roadmap de Aprendizado](#roadmap-de-aprendizado)
- [Autor](#autor)

## Visao Geral

Este repositorio foi criado para ensinar como desenvolver uma API de upload de arquivos de forma profissional.

Voce, Francisco Stanley Rodrigues Albuquerque, e a pessoa instrutora deste conteudo, e usou este projeto para aplicar esse ensino com outras pessoas.

O foco principal e o Multer, mas o projeto tambem mostra boas praticas de arquitetura e manutencao:

- API versionada em /api/v1
- Separacao por camadas (route, controller, service, repository)
- Validacao de payload com Zod
- Tratamento global de erros
- Documentacao OpenAPI + Swagger UI
- Testes unitarios e de integracao
- Lint e formatacao automatica

## Tecnologias Utilizadas

### Runtime da API

| Tecnologia         | Para que serve no projeto                                                      |
| ------------------ | ------------------------------------------------------------------------------ |
| Node.js            | Ambiente de execucao JavaScript no servidor.                                   |
| Express            | Framework HTTP para criar rotas, middlewares e resposta da API.                |
| Multer             | Middleware de upload para receber multipart/form-data e salvar arquivos.       |
| Dotenv             | Carrega variaveis de ambiente do arquivo .env, como a porta da aplicacao.      |
| Zod                | Valida e normaliza payload do body antes de chegar na regra de negocio.        |
| Swagger UI Express | Publica interface visual da documentacao OpenAPI na rota /docs.                |
| YAMLJS             | Faz parse do arquivo docs/openapi.yaml para montar a documentacao em runtime.  |
| Sucrase            | Suporte de transpile/register no ambiente de debug via nodemon.json (execMap). |

### Desenvolvimento e Qualidade

| Tecnologia | Para que serve no projeto                                                |
| ---------- | ------------------------------------------------------------------------ |
| Nodemon    | Reinicia automaticamente o servidor durante desenvolvimento.             |
| Vitest     | Framework principal de testes unitarios e de integracao.                 |
| Supertest  | Simula chamadas HTTP para testar endpoints sem subir servidor externo.   |
| ESLint     | Analise estatica para manter padrao e evitar problemas comuns no codigo. |
| Prettier   | Formatacao automatica para manter consistencia visual dos arquivos.      |

## Arquitetura do Projeto

Estrutura atual:

```text
.
├── app.js
├── server.js
├── docs/
│   ├── code-quality.md
│   └── openapi.yaml
├── src/
│   ├── controllers/
│   │   └── upload.controller.js
│   ├── errors/
│   │   └── app-error.js
│   ├── middlewares/
│   │   ├── error-handler.middleware.js
│   │   ├── not-found.middleware.js
│   │   ├── upload.middleware.js
│   │   └── validate-payload.middleware.js
│   ├── repositories/
│   │   └── upload.repository.js
│   ├── routes/
│   │   └── uploadRouters.js
│   ├── schemas/
│   │   └── upload.schema.js
│   ├── services/
│   │   └── upload.service.js
│   └── uploads/
└── tests/
    ├── fixtures/
    ├── integration/
    └── unit/
```

### Responsabilidade por camada

- Route: define endpoints e encadeamento de middlewares
- Controller: orquestra request e response
- Service: regras de negocio
- Repository: mapeamento e persistencia dos dados de arquivo
- Middlewares: validacao, upload, 404 e tratamento de erro

## Arquitetura em Camadas

Esta API usa uma organizacao em camadas para separar responsabilidades e reduzir acoplamento.

### Entrada HTTP

- app.js: monta a aplicacao Express, carrega Swagger, registra rotas versionadas e middlewares globais.
- server.js: inicializa o servidor na porta configurada.
- src/routes/uploadRouters.js: define os endpoints e a ordem dos middlewares.

### Camada de interface (Controller)

- src/controllers/upload.controller.js: recebe dados da requisicao, chama o service e devolve status/JSON.

### Camada de negocio (Service)

- src/services/upload.service.js: concentra regras de negocio de upload single e multiple.
- Aqui ficam validacoes de dominio (exemplo: arquivo obrigatorio) e montagem da resposta de negocio.

### Camada de dados (Repository)

- src/repositories/upload.repository.js: transforma dados de arquivo em entidade padronizada para resposta/persistencia.

### Camada de validacao e cross-cutting (Middlewares)

- src/middlewares/upload.middleware.js: configuracao do Multer (destino, nome de arquivo, limite e filtro de tipo).
- src/middlewares/validate-payload.middleware.js: valida e normaliza body via Zod.
- src/middlewares/error-handler.middleware.js: trata erros de aplicacao e Multer em um formato padrao.
- src/middlewares/not-found.middleware.js: padroniza resposta 404 para rotas inexistentes.

### Camada de contrato

- docs/openapi.yaml: define o contrato OpenAPI versionado da API.

### Camada de testes

- tests/unit: valida unidades isoladas (service, controller e middleware de validacao).
- tests/integration: valida o fluxo real das rotas HTTP.

## Responsabilidade Arquivo por Arquivo

### Arquivos da raiz

- app.js: composicao da aplicacao (JSON parser, docs, rotas, not found e error handler).
- server.js: bootstrap da API, leitura de variavel de ambiente e start do listen.
- package.json: scripts, dependencias e metadados do projeto.
- nodemon.json: comportamento do nodemon em modo desenvolvimento/debug.

### Documentacao

- docs/openapi.yaml: especificacao da API (endpoints, requestBody, responses e schemas).
- docs/code-quality.md: guia de lint, format e convencao de commits.
- docs/vitest-guide.md: guia didatico sobre Vitest no contexto deste projeto.

### Codigo-fonte

- src/routes/uploadRouters.js: endpoints /single e /multiple com cadeia de middlewares.
- src/controllers/upload.controller.js: controller factory com metodos uploadSingle e uploadMultiple.
- src/services/upload.service.js: regras de negocio para upload e validacoes de dominio.
- src/repositories/upload.repository.js: serializacao de metadados de arquivos (filename, path, mimetype, size).
- src/middlewares/upload.middleware.js: estrategia de armazenamento, filtros e limites do Multer.
- src/middlewares/validate-payload.middleware.js: validacao de body com schema e erro padronizado.
- src/middlewares/error-handler.middleware.js: tradutor de excecao para resposta HTTP consistente.
- src/middlewares/not-found.middleware.js: resposta padrao para rota nao encontrada.
- src/schemas/upload.schema.js: schema Zod para title, description, tags e isPublic.
- src/errors/app-error.js: classe de erro de dominio com statusCode e details.
- src/uploads/: pasta de arquivos recebidos em runtime.

### Testes

- tests/unit/upload.service.test.js: cobre regras do service com repository mockado.
- tests/unit/upload.controller.test.js: cobre contrato do controller com service mockado.
- tests/unit/validate-payload.middleware.test.js: cobre cenarios de body valido e invalido.
- tests/integration/upload.routes.int.test.js: cobre fluxo real HTTP de upload single e multiple.
- tests/fixtures/sample.png: fixture valida para upload.
- tests/fixtures/sample.txt: fixture invalida para teste de mimetype.

## Fluxo de Upload com Multer

1. A rota recebe multipart/form-data
2. O Multer intercepta a requisicao e salva o arquivo em src/uploads
3. O middleware de validacao valida e normaliza o body
4. O controller delega para o service
5. O service aplica regra de negocio
6. O repository retorna a entidade de arquivo
7. A resposta retorna status 201 com metadados

## Como Executar

### 1) Clonar o projeto

```bash
git clone <url-do-repositorio>
cd api-upload
```

### 2) Instalar dependencias

```bash
npm install
```

### 3) Criar arquivo .env

Use o arquivo .env.example como base e crie seu .env local na raiz.

Exemplo:

```env
PORT=8080
```

### 4) Rodar em desenvolvimento

```bash
npm run dev
```

Servidor local:

- API: http://localhost:8080
- Swagger: http://localhost:8080/docs

## Variaveis de Ambiente

| Variavel | Obrigatoria | Descricao    | Exemplo |
| -------- | ----------- | ------------ | ------- |
| PORT     | Nao         | Porta da API | 8080    |

## Documentacao da API

A documentacao OpenAPI esta em:

- docs/openapi.yaml

Com o servidor ligado, abra:

- http://localhost:8080/docs

## Endpoints

Base URL:

- /api/v1/upload

### POST /api/v1/upload/single

Upload de um unico arquivo.

- Campo de arquivo: file
- Content-Type: multipart/form-data

Campos opcionais de body:

- title: string (1 a 120)
- description: string (1 a 500)
- tags: string separada por virgula (normalizada para array)
- isPublic: boolean (aceita string true ou false)

### POST /api/v1/upload/multiple

Upload de multiplos arquivos.

- Campo de arquivo: files
- Maximo: 5 arquivos
- Content-Type: multipart/form-data

Mesmos campos opcionais de body do endpoint single.

## Exemplos de Requisicao

### Upload single

```bash
curl -X POST http://localhost:8080/api/v1/upload/single \
  -F "file=@./tests/fixtures/sample.png" \
  -F "title=Avatar" \
  -F "description=Foto de perfil" \
  -F "tags=perfil,usuario" \
  -F "isPublic=true"
```

### Upload multiple

```bash
curl -X POST http://localhost:8080/api/v1/upload/multiple \
  -F "files=@./tests/fixtures/sample.png" \
  -F "files=@./tests/fixtures/sample.png" \
  -F "title=Galeria" \
  -F "tags=evento,imagens" \
  -F "isPublic=false"
```

## Validacoes e Regras

- Mime types permitidos: image/jpeg, image/png, image/webp
- Tamanho maximo por arquivo: 5MB
- Limite no multiple: 5 arquivos
- Body validado com Zod
- Campos extras no body sao rejeitados

Exemplos de erro 400 documentados:

- Payload invalido
- Arquivo nao enviado
- Arquivos nao enviados
- Tipo de arquivo nao permitido
- Limite de arquivos excedido (LIMIT_UNEXPECTED_FILE)

## Testes

### Executar todos os testes

```bash
npm test
```

Cobertura atual:

- Testes unitarios para service
- Testes unitarios para controller
- Testes unitarios para middleware de validacao
- Testes de integracao para rotas de upload (single e multiple)

## Qualidade de Codigo

Scripts principais:

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

Guia complementar:

- docs/code-quality.md

## Boas Praticas de Commit

Este projeto segue o padrao Conventional Commits para manter historico limpo e facilitar revisao, changelog e release.

Sintaxe recomendada:

```text
tipo(escopo-opcional): descricao curta no imperativo
```

Exemplos reais para este projeto:

- feat(upload): adiciona endpoint de upload multiplo
- fix(middleware): corrige validacao de mimetype no multer
- docs(readme): adiciona guia de uso no insomnia
- test(service): cobre erro de arquivo ausente
- refactor(controller): simplifica factory de upload
- chore(eslint): ajusta regras de lint e formatacao

Tipos mais usados:

- feat: nova funcionalidade
- fix: correcao de bug
- docs: alteracao em documentacao
- test: criacao ou ajuste de testes
- refactor: refatoracao sem alterar comportamento externo
- chore: tarefa tecnica sem impacto direto na regra de negocio
- style: ajuste visual/formatacao sem alterar logica

Boas praticas:

- use mensagens curtas e objetivas
- mantenha um unico objetivo por commit
- evite commit gigante com mudancas sem relacao
- prefira ingles nos tipos e descricao para padrao de mercado
- relacione com contexto tecnico quando util (escopo)

Exemplo de fluxo:

```bash
git add .
git commit -m "feat(upload): adiciona validacao de payload com zod"
```

## Roadmap de Aprendizado

Sugestao de evolucao para estudar mais:

1. Adicionar autenticacao JWT
2. Salvar metadados no banco de dados
3. Implementar storage em nuvem (S3, Cloudinary)
4. Adicionar observabilidade (logs estruturados e metricas)
5. Configurar CI no GitHub Actions

## Autor

Francisco Stanley Rodrigues Albuquerque

Instrutor e criador do projeto educacional api-upload.
