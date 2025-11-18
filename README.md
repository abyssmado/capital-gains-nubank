# Nubank | Capital Gains

<h1 align="center">
  <img alt="cgapp logo" src="https://logodownload.org/wp-content/uploads/2019/08/nubank-logo-0-1.png" width="220px"/><br/>
  Nubank | Capital Gains
</h1>

<p align="center">
  Um teste técnico em TypeScript para a posição de Engenheiro de Software. <b>Build conteinerizada</b>, <b>testes</b> e <b>documentação</b>.
  <br/><br/>
  Código limpo, bem testado, bem documentado e pensado para manutenção e evolução. 🚀
</p>

<hr/>

# ☄ Sobre o Projeto

Este projeto é uma CLI (linha de comando) que processa um JSON de operações financeiras e calcula o imposto sobre ganho de capital para cada operação de venda, seguindo as regras definidas no enunciado do desafio. A ideia é ter uma ferramenta simples, determinística e fácil de executar localmente ou em container.

O foco foi em:
- legibilidade e manutenibilidade do código,
- testes (cobertura e cenários reais),
- execução reprodutível via Docker,
- e documentação clara para avaliadores.

# 💻 Tech Stack & Libs

Principais tecnologias usadas e por que as escolhi:

- Node.js — runtime estável e popular para CLIs em JavaScript/TypeScript.
- TypeScript — tipagem estática para reduzir bugs, melhorar refatoração e documentação do domínio.
- Jest + ts-jest — testes unitários e de integração com bom ecossistema para TypeScript.
- Commander — para facilitar a construção da interface CLI (parsing de argumentos).
- ESLint + Prettier — lint e formatação para manter consistência do código.
- Docker — para build e execução reprodutível em diferentes ambientes.

Observação: o package.json do projeto mostra dependências como commander, jest, ts-node, TypeScript, ESLint e Prettier. Cada uma foi incluída para tarefas específicas (CLI, testes, execução em dev, qualidade de código).

# 🚀 Como Instalar

Requisitos:
- Node.js v16+ (recomendado)
- npm v7+ (ou Yarn)
- (opcional) Docker + Docker Compose — para executar em container

Passos rápidos:

1. Clone o repositório
```bash
git clone https://github.com/abyssmado/capital-gains-nubank.git
cd capital-gains-nubank
```

2. Instale dependências
```bash
npm install
```

3. Build (compilar TypeScript)
```bash
npm run build
```

4. Executar (assumindo que compilou para /dist)
```bash
# executa leitura de stdin e escreve em stdout
node dist/main.js < input.txt > output.txt
# ou, com script definido no package.json
npm start < input.txt > output.txt
```

Modo desenvolvimento (sem build):
```bash
npm run dev
# Exemplo: echo '[{"operation":"buy","unit-cost":10,"quantity":100}]' | npm run dev
```

Docker (opcional)

Você pode buildar e executar a aplicação dentro de um container. Abaixo estão exemplos práticos (com comandos para Windows cmd.exe e PowerShell quando aplicável).

1) Build da imagem

```cmd
npm run docker:build
```

2) Executar a aplicação (duas formas)

- Passando o arquivo de entrada como parâmetro (recomendado)

  No cmd.exe:
  ```cmd
  npm run docker:run-file
  ```

  No PowerShell:
  ```powershell
  docker run --rm -v "${PWD}/stdout:/app/stdout" -v "${PWD}/stdin:/app/stdin" capital-gains-ts:latest process /app/stdin/input.txt
  ```

- Modo interativo (cola/insere JSON no stdin)

  No cmd.exe (interactive):
  ```cmd
  npm run docker:run
  ```

  Observação: o modo interativo abre a CLI dentro do container; você pode colar JSON válido e aguardar o timeout automático ou encerrar a entrada para que a aplicação processe os dados. Para enviar o conteúdo de um arquivo ao modo interativo use um pipe (ex.: `type stdin\\input.txt | docker run --rm -i -v "%cd%\\stdout:/app/stdout" capital-gains-ts:latest`).

Notas rápidas:
- O container escreve o resultado em `/app/stdout`; a pasta `./stdout` do projeto é montada para acessar os arquivos localmente.
- Se alterar o `Dockerfile`, rode `npm run docker:build` antes de `docker run`.

Dica: o script `npm start` espera que a pasta dist exista (após `npm run build`). Use `npm run dev` para executar diretamente em TypeScript via ts-node durante desenvolvimento.

# ⌨️ Utilizando o sistema

Formato esperado (stdin): um array JSON com objetos de operação. Exemplo:

```json
[
  { "operation": "buy", "unit-cost": 10.0, "quantity": 100 },
  { "operation": "sell", "unit-cost": 15.0, "quantity": 50 }
]
```

Exemplo de execução:
```bash
npm start < example/input.txt > example/output.txt
```

Output (stdout): um array JSON com objetos contendo o campo `tax`, por exemplo:
```json
[
  { "tax": 0.0 },
  { "tax": 0.0 }
]
```

Importante:
- A aplicação assume JSON válido na entrada; erros de formatação não são corrigidos automaticamente.
- Cada execução reinicia o estado em memória.

# 🧭 Decisões técnicas e arquiteturais

Resumo das escolhas e por quê:

- In-memory state: simples e suficiente para o escopo do desafio; evita complexidade de persistência e facilita testes determinísticos.
- TypeScript + tipagem: reduz bugs, facilita entendimento do domínio (modelos de operação) e ajuda a manter invariantes.
- Arquitetura modular: separação entre parsing/IO, regras de negócio (cálculo), e camada de apresentação; favorece extensibilidade (ex.: trocar CLI por API com pouco esforço).
- Precisão decimal: todos os valores são arredondados a 2 casas decimais no output para cumprir requisitos financeiros. Decisão de arredondar no final do cálculo para reduzir acumulação de erros.
- Testes automatizados: foco em testes unitários para regras de negócio e testes de integração para o fluxo input → output.
- CLI-first: implementado para facilitar avaliação, mas camada de aplicação é desacoplada para permitir adaptação (API, worker) sem reescrever regras.

# ✅ Testes

Executar:
```bash
npm test
```

Scripts úteis:
- npm run test:watch — roda em modo watch
- npx jest --coverage — gera relatório de cobertura (se configurado)

O que está coberto:
- Unit tests: todas as regras de cálculo e transformações críticas.
- Integration tests: fluxo completo de leitura e escrita (stdin/stdout).
- Edge cases: vendas acima de posições, vendas parciais, sequências complexas de operações.

# 📝 Observações e limitações

- Entrada: o app assume JSON bem formado; não há tratamento extensivo para JSON malformado por design (conforme enunciado).
- Persistência: estado em memória — ideal para o desafio, mas se for requisito de escala/recuperação, sugerimos camada de persistência.
- Casas decimais: saída com 2 casas decimais. Valores terminando em .00 podem aparecer como inteiros dependendo de serialização; stringify do JSON é usada para saída.
- Performance: implementado para ser eficiente com listas grandes, mas não foi projetado para processamento em massa em paralelo (para esse caso, considerar stream processing).
- Logging: implementação minimalista para não poluir saída de avaliação; logs podem ser ativados/adicionados facilmente.

# 🔧 Scripts disponíveis (package.json)

- npm run dev        — executa com ts-node (dev)
- npm run build      — compila TypeScript para dist/
- npm start          — executa dist/main.js
- npm test           — roda testes (jest)
- npm run test:watch — jest em modo watch
- npm run lint       — eslint
- npm run format     — prettier && eslint --fix
- docker scripts para build/run/compose (conforme package.json)

# 🙏 Considerações finais

Obrigado por dedicar tempo para revisar este repositório. Fiz este projeto pensando em clareza, testeabilidade e extensibilidade — tudo isso com um olhar para a qualidade do código e boas práticas. Se quiser, eu posso:

- abrir um PR com este README substituindo o atual;
- ajustar o texto (versão mais curta ou mais técnica);
- adicionar badges (build/test/coverage);
- atualizar scripts Docker conforme preferir.

Se quiser que eu abra um PR com este README, me diga qual branch prefere como base (main ou outra) e eu crio o PR.

# 💜 Agradecimentos

Agradeço ao avaliador pelo tempo e atenção. Se aparecerem dúvidas ou quiser ver uma demo/o passo a passo ao vivo, posso ajudar.