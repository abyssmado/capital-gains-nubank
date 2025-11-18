# Capital Gains (TypeScript)

Aplicação CLI em TypeScript para processar operações financeiras e calcular tributos (capital gains). O aplicativo pode ler operações em JSON diretamente da entrada padrão (stdin), de um arquivo ou em modo interativo, processar as operações através de um pipeline (parse -> validate -> transform -> handle) e persistir resultados em `./stdout`.

Este README cobre: instalação, execução, uso do CLI (arquivo, stdin, interativo), execução em desenvolvimento, testes, lint/format, e uso com Docker.

---

## Funcionalidades principais

- Processamento de operações financeiras em JSON (pipeline: parsing, validação, transformação, cálculo).
- Entrada por argumento: caminho para arquivo ou `-` para stdin.
- Modo interativo quando nenhum argumento é fornecido (lê linha-a-linha do stdin).
- Abstração `FileProvider` para operações de arquivo (facilita testes/mocks).
- Resultados gravados em `./stdout` (persistência de saída).
- Modular: `processLine` exportado como função reutilizável para testes e integração.

---

## Pré-requisitos

- Node.js >= 18 (o repositório foi desenvolvido com Node 20/21, compatível com LTS moderno)
- npm
- (Opcional) Docker para containerização

---

## Instalação (local)

1. Clone o repositório e entre na pasta:

```bash
git clone <repo-url>
cd capital-gains-ts
```

2. Instale dependências:

```bash
npm ci
```

---

## Scripts úteis (npm)

- `npm run dev` — roda em modo de desenvolvimento com `ts-node` (executa `src/main.ts`).
- `npm run build` — transpila TypeScript para `dist/` (executa `tsc`).
- `npm start` — executa a versão compilada (`node dist/main.js`).
- `npm test` — executa a suíte de testes (Jest + ts-jest).
- `npm run lint` — executa ESLint.
- `npm run lint:fix` — aplica correções automáticas do ESLint quando possível.
- `npm run format` — aplica Prettier e `eslint --fix` (formatação + organização de imports quando configurado).
- `npm run docker:build` / `npm run docker:run` — helpers para imagem Docker (veja seção Docker).

> Nota: em Windows `cmd.exe`, alguns comandos npm que aceitam argumentos exigem o uso de `--` para passar argumentos ao script. Por exemplo: `npm run dev -- process ./stdin/input.txt`.

---

## Uso do CLI

O comando principal é `process` e aceita um argumento opcional `[file]`:

- `process [file]` — se `file` for um caminho válido, o conteúdo do arquivo será lido e cada linha não vazia será processada.
- `process -` — lê do stdin (use pipe).
- sem argumentos — inicia o modo interativo (loop) que lê linha-a-linha do stdin até o usuário encerrar (Ctrl+C).

Exemplos (assumindo que você executou `npm run build`):

- Processar um arquivo local (Windows cmd.exe):

```cmd
node dist/main.js process stdin\input.txt
```

- Ler do stdin (pipe):

```cmd
type stdin\input.txt | node dist/main.js process -
```

- Rodar em modo desenvolvimento (ts-node):

```cmd
npm run dev -- process stdin\input.txt
```

- Entrar em modo interativo (nenhum argumento):

```cmd
node dist/main.js
# ou
npm run dev
```

No container (veja Dockerfile em `Dockerfile`): o ENTRYPOINT padrão no container passa o comando `process -` (stdin). Você também pode sobrescrever o CMD/args.

---

## Formato de entrada (exemplo)

Cada linha lida pela aplicação deve ser um JSON válido que representa uma ou mais operações. Exemplo simplificado de linha contendo um array de operações:

```json
[{ "operation": "buy", "unit-cost": 10.0, "quantity": 100, "ticker": "ABC" }]
```

Também são aceitas linhas com um único objeto ou outros formatos que seu parser interno entende — ver os testes em `src/application/core/commands/order-operations/pipes` para exemplos reais.

---

## Saída e persistência

- Saída standard (console): os resultados e mensagens de erro são impressos no console.
- Persistência: os resultados processados são gravados em `./stdout` (pasta criada se necessário). O arquivo exato utilizado pela aplicação é `./stdout/result.txt` ou similar (ver implementação de `handle.ts`).

Se você executar a imagem Docker, o `Dockerfile` já copia `stdout/` para dentro do container e o `docker run` sugerido no `package.json` monta `stdout` para o host, permitindo que você pegue os arquivos produzidos.

---

## Estrutura do projeto (resumo)

- `src/` — código fonte em TypeScript
  - `application/core/commands/order-operations` — pipeline do comando `process` (parse, validate, transform, handle, loop, cli.command)
  - `application/core/services` — regras de negócios (ex.: cálculo de tributos)
  - `application/shared/providers` — providers (FileProvider, CliProvider) e abstrações para facilitar testes
  - `bootstrap/cli.bootstrap.ts` — registra comandos e inicia CLI ou modo interativo
  - `main.ts` — entrypoint de execução em desenvolvimento/produção
- `dist/` — saída compilada (após `npm run build`)
- `stdout/` — saída persistida (resultados)
- `tests/` / `src/**/tests` — testes Jest

---

## Testes

Execute a suíte de testes:

```bash
npm test
```

Para desenvolvimento com watch:

```bash
npm run test:watch
```

Os testes usam mocks para `FileProvider` e para injetar `stdin` em `createProcessCommand`, permitindo cobertura sem tocar o sistema de arquivos real.

---

## Lint e formatação

- Formatar e aplicar correções automáticas:

```bash
npm run format
```

- Executar apenas o lint (para inspeção):

```bash
npm run lint
```

Observação: o projeto usa Prettier e ESLint com a regra `import/order` para organizar imports. Se desejar ordenação mais avançada (ex.: agrupar por tipo e otimizar import removendo não usados), considere adicionar `eslint-plugin-simple-import-sort` ou `prettier-plugin-organize-imports`.

---

## Docker

Build da imagem:

```bash
npm run docker:build
# ou
docker build -t capital-gains-ts:latest .
```

Rodar (Windows cmd.exe, exemplo do package.json monta `stdout`):

```cmd
npm run docker:run
# equivale a:
# docker run --rm -it -v "%cd%\stdout:/app/stdout" capital-gains-ts:latest
```

Por padrão o `Dockerfile` define ENTRYPOINT para o runtime do Node e o CMD padrão como `process -` (ler do stdin). Você pode sobrescrever o comportamento:

```bash
# rodar em modo interativo (sem argumentos) a partir do container
docker run --rm -it -v "$PWD/stdout:/app/stdout" capital-gains-ts:latest node dist/main.js

# executar process com arquivo dentro do container (supondo que o arquivo seja copiado para a imagem)
docker run --rm -v "$PWD/stdout:/app/stdout" capital-gains-ts:latest node dist/main.js process /app/stdin/input.txt
```

---

## Depuração e Troubleshooting

- Erro: arquivo não encontrado — verifique o caminho relativo ao CWD onde você chamou `node`/`npm run`.
- Erro no parse JSON — a aplicação loga mensagens com o erro de parse; verifique se cada linha é JSON válido.
- Comportamento em testes: o código foi projetado para permitir injeção de `stdin` e `FileProvider` para facilitar testes sem tocar o disco.

Se encontrar problemas com a organização de imports exibindo warnings do Prettier, considere remover opções customizadas de import-order do `.prettierrc` ou instalar o plugin correspondente para Prettier.

---

## Contribuindo

1. Abra uma issue descrevendo a proposta ou bug.
2. Crie um branch com um nome significativo: `feat/<descrição>` ou `fix/<descrição>`.
3. Garanta que os testes passem localmente (`npm test`).
4. Faça lint/format (`npm run format`).
5. Abra um PR apontando para `main`.

---

## Próximos passos recomendados

- Adicionar CI (GitHub Actions) que rode `npm ci`, `npm run lint`, `npm test` e `npm run build` em PRs.
- Adicionar validação de contrato de entrada (ex.: JSON Schema) para aumentar robustez do parser.
- Considerar plugin de organização de imports para Prettier/ESLint se desejar regras mais rígidas.

---

## License

Este repositório usa a licença ISC (ver `package.json`).
