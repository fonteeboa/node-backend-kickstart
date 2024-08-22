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
```

### ⚙️ Configuração

O script configura automaticamente o ambiente de desenvolvimento, incluindo dependências essenciais e scripts no package.json. Ele também gera um arquivo .env para configuração de variáveis de ambiente específicas do projeto.

### 🌐 Integração com NeonDB

O projeto inclui suporte integrado ao NeonDB (<https://neon.tech>), um serviço de banco de dados PostgreSQL moderno e eficiente para aplicações web. NeonDB permite uma experiência de banco de dados em nuvem sem complicações, com uma arquitetura que suporta cargas de trabalho escaláveis e alto desempenho.

A implementação atual é básica, focando em estabelecer uma conexão funcional com o NeonDB e outros bancos de dados, para fornecer um ponto de partida. Este projeto é inicial e será aprimorado ao longo do tempo, com futuras atualizações planejadas para incluir melhorias na segurança do backend e na arquitetura do sistema.

Para mais informações sobre como configurar e utilizar o NeonDB, consulte a documentação oficial (<https://neon.tech/docs/introduction>).

### 📝 Scripts

npm start: Inicia o servidor de desenvolvimento.
npm dbConnection: Executa os testes De conexão com o banco de dados.

### 🤝 Contribuindo

Contribuições são bem-vindas! Se você tiver sugestões ou melhorias, sinta-se à vontade para enviar um pull request ou abrir uma issue.

### 📜 Licença

Este projeto é licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

### 🙏 Agradecimentos

Este projeto foi inspirado pela necessidade de uma configuração de projeto Node.js simplificada e organizada, com a intenção de cobrir tanto o lado client (frontend) quanto o server (backend). Agradecimentos especiais às comunidades Node.js, Express e NeonDB por suas excelentes ferramentas e documentação.
