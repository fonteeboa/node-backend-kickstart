# Node Backend Kickstart

For the English version of this README, click [here](README_EN.md).

Node Backend Kickstart é um projeto boilerplate criado para ajudá-lo a configurar rapidamente uma aplicação Node.js com uma estrutura de pastas personalizável, suporte a TypeScript e pré-configuração para conexão com alguns bancos de dados.

## 🎯 Motivação

Este projeto teve início como uma participação no [Neon Open Source Starter Kit Challenge](https://dev.to/challenges/neon) da [DEV Community](https://dev.to) e também sendo uma "extensão" do meu projeto anterior, ["react-starter"](https://github.com/fonteeboa/react-starter). Enquanto o "react-starter" foca no desenvolvimento frontend (client), o Node Backend Kickstart foi criado para facilitar o nosso dia a dia no desenvolvimento de backend (server), fornecendo uma base sólida que inclui configuração para diversos bancos de dados e uma estrutura de pastas bem definida.

A ideia é expandir este projeto para que ele abranja mais do que apenas a inicialização, incorporando também aspectos de segurança e integrações. O objetivo é que o Node Backend Kickstart evolua para se tornar uma base sólida para soluções completas, tanto no frontend quanto no backend, possibilitando a integração total entre ambos os projetos e oferecendo uma estrutura robusta e escalável para o desenvolvimento de aplicações.

## ⚙️ Funcionalidades

- Criação de um projeto Node.js com ou sem suporte a TypeScript.
- Estrutura de pastas personalizável para melhor organização do projeto.
- Configuração inicial para bancos de dados como NeonDB, PostgreSQL, MySQL, MongoDB e Kibana/Elasticsearch.
- Configuração fácil de scripts npm para iniciar o servidor e testar conexão com o bando de dados.
- Implementação de práticas de segurança recomendadas, como proteção contra XSS, sanitização de consultas, limitação de taxa de requisições, entre outros

## 🛠️ Primeiros Passos

### ✅ Pré-requisitos

Certifique-se de ter o seguinte instalado:

- Node.js (v18 or higher)
- npm (v10 ou superior)

### 📦 Uso

Para criar um novo projeto usando o script `node-backend-kickstart`, siga estes passos:

1. Clone o repositório:

    ```bash
    git clone https://github.com/seu-usuario/node-backend-kickstart.git
    cd node-backend-kickstart
    ```

2. Torne o script de configuração executável:

    ```bash
    chmod +x create_node.sh
    ```

3. Execute o script de configuração com o nome do projeto desejado e o template:

    ```bash
    ./create_node.sh nome_do_projeto [-t] [--neon] [--postgres] [--mysql] [--mongo] [--kibana] [--dbclient]
    ```

    Substitua nome_do_projeto pelo nome desejado para o projeto. Adicione as opções conforme necessário:

    `-t, --typescript`: Inicializa o projeto utilizando TypeScript.

    `--neon`: Inclui configuração para NeonDB.

    `--postgres`: Inclui configuração para PostgreSQL.

    `--mysql`: Inclui configuração para MySQL.

    `--mongo`: Inclui configuração para MongoDB.

    `--kibana`: Inclui configuração para Kibana/Elasticsearch.

    `--dbclient`: Quando utilizando NeonDB, especifica o tipo de cliente de banco de dados (neon, pg ou postgres).

### 💡 Exemplo

Para criar um projeto chamado `my-backend-project` utilizando o banco de dados da Neon:

```bash
./create_node.sh my-backend-project --neon
```

## 🗂️ Estrutura de Pastas

Após executar o script, seu projeto terá a seguinte estrutura de pastas:

```bash
my-backend-project/
├── src/
│   ├── /config/            # Configurações do servidor (ex: variáveis de ambiente)
│   ├── /controllers/       # Controladores (lógica do negócio)
│   ├── /models/            # Modelos de dados (ex: mongoose schemas)
│   ├── /routes/            # Definições de rotas
│   ├── /services/          # Serviços (ex: integração com APIs externas)
│   ├── /middlewares/       # Middlewares do Express
│   ├── /utils/             # Funções utilitárias e helpers
│   ├── /tests/             # Testes unitários (Jest + Supertest)
│   └── server.js           # Ponto de entrada do servidor (inicialização do app)
├── .gitignore
├── .env                    # Configurações de ambiente
└── package.json
```

## 📝 Exemplo de Arquivo .env

Abaixo está um exemplo do arquivo .env gerado pelo script. Este arquivo contém as variáveis de ambiente essenciais para configurar seu ambiente de desenvolvimento:

```bash
# Common settings
NODE_ENV=development
PORT=10000

# NeonDB
NEON_ENDPOINT_ID=your_neon_db_url_here
DB_CLIENT=neon
PGHOST=your_postgres_host_here
PGPORT=5432
PGUSER=your_postgres_user_here
PGPASSWORD=your_postgres_password_here
PGDATABASE=your_postgres_database_here

# Security
JWT_SECRET=your_jwt_secret_here
```

### 🛡️ Segurança

O projeto inclui as seguintes práticas de segurança:

- Helmet: Configura cabeçalhos HTTP seguros.
- xss-clean: Protege contra ataques XSS.
- express-rate-limit: Limita o número de requisições por IP para evitar ataques de força bruta.
- hpp: Protege contra poluição de parâmetros HTTP.
- express-mongo-sanitize: Sanitiza consultas MongoDB para evitar injeções NoSQL.

### ⚙️ Configuração

O script configura automaticamente o ambiente de desenvolvimento, incluindo dependências essenciais e scripts no package.json. Ele também gera um arquivo .env para configuração de variáveis de ambiente específicas do projeto.

## 🌐 Integração com NeonDB

O projeto inclui suporte integrado ao NeonDB (<https://neon.tech>), um serviço de banco de dados PostgreSQL moderno e eficiente para aplicações web. NeonDB permite uma experiência de banco de dados em nuvem sem complicações, com uma arquitetura que suporta cargas de trabalho escaláveis e alto desempenho.

A implementação atual é básica, focando em estabelecer uma conexão funcional com o NeonDB e outros bancos de dados, para fornecer um ponto de partida. Este projeto é inicial e será aprimorado ao longo do tempo, com futuras atualizações planejadas para incluir melhorias na segurança do backend e na arquitetura do sistema.

Para mais informações sobre como configurar e utilizar o NeonDB, consulte a documentação oficial (<https://neon.tech/docs/introduction>).

## 📝 Scripts

- npm start: Inicia o servidor de desenvolvimento.
- npm run dbConnection: Executa os testes de conexão com o banco de dados.
- npm run lint: Verifica o código em busca de problemas de estilo e possíveis erros utilizando ESLint.
- npm test: Executa os testes unitários utilizando o Jest.
- npm run coverage: Gera um relatório de cobertura de código utilizando nyc e jest.
- npm run audit: Realiza uma auditoria de segurança nas dependências do projeto com um nível de auditoria moderado.
- npm run audit:fix: Aplica correções automáticas para vulnerabilidades de segurança nas dependências do projeto.
- npm run prettier: Formata o código fonte utilizando Prettier, de acordo com as regras de formatação definidas.

## 🧪 Testes Unitários Pré-configurados

O Node Backend Kickstart já vem com o Jest pré-configurado para facilitar a execução de testes unitários desde o início. Isso garante que você possa validar as funcionalidades do seu código rapidamente e com eficiência. Além disso, o Supertest é utilizado para testar endpoints da API, simulando requisições HTTP como GET e POST, sem a necessidade de um servidor real ser iniciado.

### ⚙️ Configuração do Ambiente de Teste

Antes de rodar os testes unitários, é importante alterar a variável de ambiente NODE_ENV para test, em vez de development. Isso garante que os testes sejam executados em um ambiente de teste isolado, evitando impactos no ambiente de desenvolvimento ou produção.

```bash
# Exemplo de .env para testes

NODE_ENV=test
```

### 📦 Sobre as Ferramentas e Bibliotecas Adicionadas

O projeto inclui várias bibliotecas para garantir a qualidade e a segurança do código. Aqui estão algumas delas e o motivo de terem sido adicionadas:

- Jest: Jest é uma biblioteca de testes em JavaScript que permite testar o código de forma simples e eficaz. Ele suporta testes de unidade, integração e cobertura de código, sendo uma escolha popular para projetos Node.js.

- Supertest: Supertest é uma biblioteca que permite testar endpoints HTTP de maneira simples e eficaz, simulando requisições como GET, POST, PUT e DELETE. Ele é especialmente útil para verificar se a API está respondendo conforme o esperado.

- ESLint: ESLint é uma ferramenta para identificar e corrigir problemas de padrões de código em JavaScript. Ele ajuda a manter um código consistente e sem erros, promovendo boas práticas de desenvolvimento.

- Sinon: Sinon é uma biblioteca que facilita a criação de mocks, spies e stubs para testes unitários, permitindo simular comportamentos e interações em funções e objetos. É útil para isolar partes do código e testar comportamentos específicos sem dependências externas.

- NYC: NYC é uma ferramenta de cobertura de código que funciona com o Jest para gerar relatórios detalhados sobre quais partes do código estão sendo testadas. Isso ajuda a identificar áreas que precisam de mais atenção em termos de testes.

- npm-audit-resolver: O npm-audit-resolver foi adicionado para ajudar a resolver problemas de segurança nas dependências do projeto. Ele automatiza a resolução de vulnerabilidades encontradas pelo npm audit, permitindo aplicar correções de forma mais eficiente.

### 🚀 Executando os Testes Unitários

Para executar os testes unitários, siga os passos abaixo:

 Defina o ambiente de teste: Certifique-se de que a variável NODE_ENV esteja definida como test no seu arquivo .env.

```bash
NODE_ENV=test
```

 Execute os testes:

```bash
npm test
```

Isso iniciará os testes unitários utilizando o Jest e o Supertest, garantindo que os endpoints da API sejam validados corretamente sem a necessidade de iniciar um servidor real.

### 📊 Gerar relatório de cobertura

Para gerar um relatório de cobertura de código, utilize o seguinte comando:

```bash
npm run coverage
```

Isso gerará um relatório detalhado, mostrando quais partes do código foram cobertas pelos testes.

Essa pré-configuração permite que você comece a testar seu código imediatamente, mantendo um alto padrão de qualidade e segurança no seu projeto Node.js.

## 🤝 Contribuindo

Contribuições são bem-vindas! Se você tiver sugestões ou melhorias, sinta-se à vontade para enviar um pull request ou abrir uma issue.

## 📜 Licença

Este projeto é licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🙏 Agradecimentos

Este projeto foi inspirado pela necessidade de uma configuração de projeto Node.js simplificada e organizada, com a intenção de cobrir tanto o lado client (frontend) quanto o server (backend). Agradecimentos especiais às comunidades Node.js, Express e NeonDB por suas excelentes ferramentas e documentação.
