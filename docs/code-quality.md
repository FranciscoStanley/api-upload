# Code Quality

## Scripts

- `npm run lint`: verifica problemas de estilo e qualidade.
- `npm run lint:fix`: corrige automaticamente o que for possivel.
- `npm run format`: aplica formatacao com Prettier.
- `npm run format:check`: valida se os arquivos estao formatados.

## Recomendado no dia a dia

1. `npm run lint`
2. `npm run test`
3. `npm run format:check`

## Convencao de commits

Para praticar boas praticas de mercado, use Conventional Commits.

Formato:

`tipo(escopo-opcional): descricao`

Exemplos:

- `feat(upload): adiciona suporte a upload multiplo`
- `fix(schema): corrige validacao de campo title`
- `docs(readme): melhora instrucoes de instalacao`
- `test(integration): cobre erro de limite de arquivos`
- `refactor(service): separa responsabilidade de validacao`

Tipos recomendados:

- `feat`
- `fix`
- `docs`
- `test`
- `refactor`
- `chore`
- `style`

Checklist antes do commit:

1. Rodar `npm run lint`
2. Rodar `npm test`
3. Rodar `npm run format:check`
4. Escrever mensagem de commit no formato padrao
