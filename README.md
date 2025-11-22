<div align="center">

# 🚀 HITSYS

### Sistema Integrado de Gestão Empresarial

*Uma solução completa e moderna para gerenciamento de vendas, estoque, clientes e finanças*

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Electron](https://img.shields.io/badge/Electron-37.4.0-47848F?logo=electron)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)

</div>

---

## 📋 Sobre o Projeto

**HITSYS** é um sistema ERP (Enterprise Resource Planning) desenvolvido como aplicação desktop multiplataforma usando Electron, React e Node.js. O sistema oferece uma interface moderna e intuitiva para gerenciar todos os aspectos operacionais de empresas de pequeno e médio porte.

### ✨ Principais Funcionalidades

- 🏪 **Ponto de Venda (PDV)** - Interface otimizada para vendas rápidas
- 📦 **Gestão de Estoque** - Controle completo de produtos, grupos, marcas e seções
- 👥 **Cadastro de Clientes** - Gerenciamento detalhado de pessoas e empresas
- 💰 **Financeiro** - Contas a pagar, contas a receber e formas de pagamento
- 🛒 **Orçamentos e Vendas** - Geração e acompanhamento de orçamentos e vendas
- 📊 **Comissões** - Cálculo e controle de comissões de vendedores
- 🏢 **Multi-empresa** - Suporte para múltiplas empresas
- 👤 **Controle de Acesso** - Sistema de usuários, perfis e permissões
- 📝 **Auditoria** - Rastreamento completo de operações do sistema
- 🌍 **Cadastro de Localidades** - Gerenciamento de cidades

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19.1.1** - Biblioteca para construção de interfaces
- **React Router DOM** - Navegação entre páginas
- **Bootstrap 5.3** - Framework CSS para estilização
- **Vite 7.1** - Build tool e dev server de alta performance

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express 5.1** - Framework web minimalista
- **Knex.js 3.1** - Query builder SQL
- **MySQL2** - Banco de dados relacional
- **JWT** - Autenticação e autorização
- **Bcrypt** - Criptografia de senhas

### Desktop
- **Electron 37.4** - Framework para aplicações desktop
- **Electron Builder** - Empacotamento e distribuição

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** (geralmente vem com Node.js)
- **MySQL** (versão 5.7 ou superior)
- **Git** (para clonar o repositório)

---

## 🚀 Instalação

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/Tchauperas/HITSYS.git
cd HITSYS
```

### 2️⃣ Instale as dependências

```bash
npm install
```

### 3️⃣ Configure o banco de dados

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Configurações do Banco de Dados
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=hitsys
DB_PORT=3306

# Configurações JWT
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=24h

# Configurações do Servidor
PORT=3000
NODE_ENV=development
```

### 4️⃣ Execute as migrações do banco de dados

```bash
# Execute suas migrations/seeds conforme configurado
npx knex migrate:latest
npx knex seed:run
```

---

## 💻 Como Usar

### Modo Desenvolvimento

#### Opção 1: Executar Frontend e Backend separadamente

**Terminal 1 - Frontend (Vite + Electron):**
```bash
npm run dev
```

**Terminal 2 - Backend (API):**
```bash
npm run devStart
```

#### Opção 2: Executar tudo junto
```bash
# Em desenvolvimento com hot-reload
npm run dev
```

### Modo Produção

#### Executar o aplicativo compilado:
```bash
npm start
```

#### Compilar para distribuição:
```bash
npm run compile
```

Os executáveis estarão disponíveis na pasta `HITSYSTEM/` nos formatos:
- **Linux**: `.AppImage` e `.deb`

---

## 📁 Estrutura do Projeto

```
HITSYS/
├── src/
│   ├── backend/           # Servidor Node.js/Express
│   │   ├── api/
│   │   │   ├── configs/   # Configurações (DB, etc)
│   │   │   ├── controllers/ # Lógica de negócio
│   │   │   ├── middlewares/ # Middlewares (auth, etc)
│   │   │   ├── models/    # Modelos de dados
│   │   │   ├── routers/   # Rotas da API
│   │   │   └── services/  # Serviços auxiliares
│   │   └── server.js      # Ponto de entrada do servidor
│   │
│   └── ui/                # Interface React
│       ├── assets/        # Recursos estáticos
│       ├── components/    # Componentes reutilizáveis
│       ├── pages/         # Páginas da aplicação
│       ├── App.jsx        # Componente principal
│       └── main.jsx       # Ponto de entrada React
│
├── renderer/              # Build do frontend
├── main.js                # Processo principal do Electron
├── preload.js             # Script de preload do Electron
├── index.html             # HTML principal
├── vite.config.js         # Configuração do Vite
├── package.json           # Dependências e scripts
└── README.md              # Este arquivo
```

---

## 🔑 Funcionalidades Detalhadas

### 🏪 Ponto de Venda (PDV)
Interface otimizada para realizar vendas com agilidade, incluindo:
- Busca rápida de produtos
- Adição/remoção de itens no carrinho
- Aplicação de descontos
- Múltiplas formas de pagamento
- Emissão de comprovantes

### 📦 Gestão de Produtos
- Cadastro completo de produtos com código de barras
- Organização por grupos, marcas e seções
- Controle de unidades de medida
- Gestão de preços e custos
- Controle de estoque mínimo

### 👥 Gestão de Clientes
- Cadastro de pessoas físicas e jurídicas
- Histórico de compras
- Limite de crédito
- Múltiplos contatos e endereços

### 💰 Módulo Financeiro
- Contas a pagar e receber
- Múltiplas formas de pagamento
- Geração de relatórios financeiros
- Controle de comissões de vendedores

### 👤 Controle de Acesso
- Sistema de login com autenticação JWT
- Perfis de usuário personalizáveis
- Controle granular de permissões
- Auditoria de ações dos usuários

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento Vite |
| `npm run build` | Cria build de produção do frontend |
| `npm run devStart` | Inicia o servidor backend com nodemon |
| `npm start` | Compila e executa o aplicativo Electron |
| `npm run compile` | Cria executáveis para distribuição |
| `npm run lint` | Executa o linter ESLint |
| `npm run preview` | Preview do build de produção |

---

## 🐛 Problemas Conhecidos

Para reportar bugs ou solicitar novas funcionalidades, acesse:
👉 [Issues no GitHub](https://github.com/Tchauperas/HITSYS/issues)

---

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Tchauperas**

- GitHub: [@Tchauperas](https://github.com/Tchauperas)
- Repositório: [HITSYS](https://github.com/Tchauperas/HITSYS)

---

<div align="center">

### ⭐ Se este projeto foi útil para você, considere dar uma estrela!

**Desenvolvido com ❤️ usando Electron + React + Node.js**

</div>