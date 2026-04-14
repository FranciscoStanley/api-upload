# Guia de Vitest

## Objetivo deste documento

Este guia explica como o Vitest funciona neste projeto, o que foi usado na pratica e para que cada recurso serve.

Este material tambem faz parte do conteudo de ensino criado por Francisco Stanley Rodrigues Albuquerque para ensinar outras pessoas a testar APIs Node.js com abordagem profissional.

## O que e o Vitest

Vitest e um framework de testes para projetos JavaScript e TypeScript.

Principais vantagens:

- Execucao rapida
- API parecida com Jest
- Bom suporte a ESM
- Integracao simples com projetos Node.js

No projeto, ele e usado para garantir que regras de negocio, controladores, middlewares e rotas continuem corretos a cada mudanca.

## Como o Vitest esta configurado aqui

No arquivo package.json:

- Script de teste unico: npm test executa vitest run
- Script de modo desenvolvimento: npm run test:watch executa vitest

Isso permite:

- Rodar tudo em modo CI com resultado final
- Rodar em modo watch para feedback continuo durante desenvolvimento

## Estrategia de testes adotada

Foram usados dois niveis principais:

1. Testes unitarios
2. Testes de integracao

### 1) Testes unitarios

Objetivo:

- Testar uma unidade isolada
- Evitar dependencias reais externas
- Validar regras com previsibilidade

Arquivos do projeto:

- tests/unit/upload.service.test.js
- tests/unit/upload.controller.test.js
- tests/unit/validate-payload.middleware.test.js

Tecnicas usadas:

- describe para agrupar cenarios
- it para definir casos de teste
- expect para assercoes
- vi.fn para mocks e spies

Exemplo de uso no projeto:

- Mock do repository no service para testar regra de negocio sem persistencia real
- Mock do service no controller para testar apenas o contrato HTTP de resposta

### 2) Testes de integracao

Objetivo:

- Testar o comportamento real das rotas
- Validar pipeline completo de middleware, controller, service e resposta

Arquivo do projeto:

- tests/integration/upload.routes.int.test.js

Ferramenta de apoio:

- Supertest para simular requisicoes HTTP sem subir servidor externo

Cenarios cobertos:

- Upload single com sucesso
- Upload multiple com sucesso
- Payload invalido
- Arquivo ausente
- Lista de arquivos ausente
- Limite de arquivos excedido
- Tipo de arquivo nao permitido

## Recursos do Vitest usados e para que servem

### describe

Serve para organizar blocos de teste por contexto.

Uso no projeto:

- UploadService
- UploadController
- validatePayload middleware
- Upload routes integration

### it

Serve para descrever um comportamento esperado de forma objetiva.

Exemplo de intencao:

- deve retornar 400 quando arquivo nao for enviado

### expect

Serve para validar resultados.

Assercoes usadas:

- toBe
- toEqual
- toHaveLength
- toHaveBeenCalledWith
- toBeInstanceOf
- toMatchObject
- arrayContaining e objectContaining

### vi

Namespace utilitario do Vitest para mocks.

Uso no projeto:

- vi.fn para criar funcoes simuladas
- mockResolvedValue para controlar retorno assincrono de dependencia

### Hooks

Hook usado:

- afterEach no teste de integracao

Finalidade:

- limpar arquivos criados em src/uploads apos cada teste
- evitar efeito colateral entre cenarios

## Boas praticas que este projeto aplica

- Nomes de teste orientados a comportamento
- Um unico motivo por teste
- Mocks apenas no nivel unitario
- Integracao cobrindo regras criticas da API
- Validacao de erros de negocio e de infraestrutura
- Limpeza de recursos no pos-teste

## Como executar os testes

### Executar toda a suite

npm test

### Executar em watch

npm run test:watch

## Leitura rapida dos resultados

Quando a suite passa:

- Test Files mostra quantos arquivos de teste passaram
- Tests mostra quantidade total de cenarios
- Duration mostra tempo total da execucao

Quando falha:

- leia a primeira falha com atencao
- identifique se e erro de regra de negocio, contrato de rota ou mock incorreto
- corrija e execute novamente

## Quando criar teste unitario e quando criar integracao

Use unitario quando:

- quer validar regra isolada
- precisa de resposta rapida
- depende de mocks para controlar cenarios extremos

Use integracao quando:

- quer validar fluxo ponta a ponta da API
- precisa garantir contrato HTTP
- precisa testar encadeamento real de middleware + controller + service

## Resumo

Neste projeto, o Vitest nao esta apenas presente: ele faz parte da arquitetura de qualidade.

- Unitarios garantem confianca das regras locais
- Integracao garante confianca do fluxo real
- Mocks e hooks foram usados com objetivo claro

Esse conjunto ajuda voce a praticar desenvolvimento profissional com feedback rapido e seguranca para evoluir o codigo.
