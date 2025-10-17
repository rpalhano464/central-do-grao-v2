# 🌾 Central do Grão - MVP v2

**Assistente Inteligente para Armazenagem de Grãos**

[![Status](https://img.shields.io/badge/status-MVP-orange)](https://github.com)
[![Versão](https://img.shields.io/badge/versão-2.0.0-blue)](https://github.com)
[![Licença](https://img.shields.io/badge/licença-MIT-green)](LICENSE)

---

## 📋 Sobre o Projeto

O **Central do Grão** é uma aplicação web/mobile desenvolvida para profissionais do setor de armazenagem de grãos, oferecendo:

- 💬 **Assistente Conversacional** inteligente sobre armazenagem
- 🧮 **Calculadoras** especializadas (Secagem, Expurgo, Aeração)
- 🐛 **Identificador de Pragas** com métodos de controle
- 📈 **Painel de Mercado** com cotações em tempo real
- 🛒 **Sistema de Compras** para solicitar produtos e serviços
- 👤 **Cadastro de Usuários** com dados completos

---

## 🎯 Público-Alvo

- Operadores de silos
- Gerentes de cooperativas e cerealistas
- Diretores de cooperativas
- Engenheiros agrônomos
- Compradores de cooperativas
- Profissionais do agronegócio

---

## ✨ Funcionalidades

### 1. Sistema de Cadastro
- Coleta de dados completos do usuário
- Armazenamento seguro em banco de dados
- Persistência local para melhor experiência

### 2. Assistente Conversacional
- Saudação personalizada com nome do usuário
- Base de conhecimento sobre armazenagem
- Respostas contextualizadas
- Sugestões rápidas

### 3. Calculadoras Técnicas
- **Secagem:** Cálculo de quebra de peso
- **Expurgo:** Dosagem de fosfina para fumigação
- **Aeração:** Tempo de renovação do ar

### 4. Identificador de Pragas
- Catálogo com principais pragas
- Descrições detalhadas
- Métodos de controle

### 5. Painel de Mercado
- Cotações de Soja, Milho e Trigo
- Variações em tempo real
- Informações de mercado

### 6. Sistema de Compras (NOVO)
- Solicitação de produtos e serviços
- Envio automático de e-mail
- Histórico de solicitações
- Dados do usuário incluídos automaticamente

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- HTML5
- CSS3 (Design responsivo)
- JavaScript (ES6+)
- LocalStorage para persistência

### Backend
- Node.js
- Express.js
- SQLite3
- CORS

### Infraestrutura
- Git para versionamento
- GitHub para hospedagem do código

---

## 📦 Estrutura do Projeto

```
central-do-grao-v3/
├── frontend/
│   ├── index.html          # Aplicação principal
│   └── app.js              # Lógica JavaScript
├── backend/
│   ├── server.js           # API REST
│   ├── package.json        # Dependências
│   └── central-grao-v3.db  # Banco de dados (não versionado)
├── .gitignore
├── README.md
└── GUIA_DE_TESTES.md      # Documentação de testes
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 14+ instalado
- npm ou yarn

### Passo 1: Clone o repositório
```bash
git clone https://github.com/seu-usuario/central-do-grao.git
cd central-do-grao
```

### Passo 2: Instale as dependências do backend
```bash
cd backend
npm install
```

### Passo 3: Inicie o backend
```bash
npm start
# Servidor rodando em http://localhost:3001
```

### Passo 4: Inicie o frontend
```bash
cd ../frontend
python3 -m http.server 8080
# Ou use qualquer servidor HTTP estático
```

### Passo 5: Acesse no navegador
```
http://localhost:8080
```

---

## 📊 API Endpoints

### Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/usuarios` | Cadastrar novo usuário |
| GET | `/api/usuarios` | Listar todos os usuários |
| GET | `/api/usuarios/email/:email` | Buscar usuário por e-mail |

### Solicitações de Compra

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/solicitacoes` | Criar nova solicitação |
| GET | `/api/solicitacoes` | Listar solicitações |
| PATCH | `/api/solicitacoes/:id/status` | Atualizar status |

### Health Check

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Verificar status da API |

---

## 💾 Banco de Dados

### Tabela: usuarios

```sql
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empresa TEXT,
    nome TEXT NOT NULL,
    funcao TEXT,
    email TEXT NOT NULL UNIQUE,
    telefone TEXT,
    endereco TEXT,
    cidade TEXT,
    estado TEXT,
    cep TEXT,
    cnpj TEXT,
    cpf TEXT,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: solicitacoes_compra

```sql
CREATE TABLE solicitacoes_compra (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    usuario_nome TEXT,
    usuario_email TEXT,
    usuario_telefone TEXT,
    usuario_empresa TEXT,
    mensagem TEXT NOT NULL,
    status TEXT DEFAULT 'pendente',
    data_solicitacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

---

## 🧪 Testes

Consulte o arquivo [GUIA_DE_TESTES.md](GUIA_DE_TESTES.md) para instruções detalhadas de teste.

### Teste Rápido
```bash
# Verificar se o backend está funcionando
curl http://localhost:3001/api/health
```

---

## 📈 Roadmap

### Versão 2.1 (Próxima)
- [ ] Integração com serviço de e-mail (Nodemailer/SendGrid)
- [ ] Painel administrativo
- [ ] Notificações por e-mail
- [ ] Exportação de dados (CSV/Excel)

### Versão 3.0 (Futuro)
- [ ] Integração com OpenAI API para respostas mais inteligentes
- [ ] Aplicativo mobile nativo (React Native)
- [ ] Sistema de autenticação completo
- [ ] Dashboard com métricas e analytics
- [ ] Integração com APIs de cotações reais
- [ ] Sistema de pagamentos

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Autores

- **Equipe Central do Grão** - *Desenvolvimento inicial*

---

## 📞 Contato

- **E-mail:** renato@gpdvetquimica.com.br
- **Website:** [Em desenvolvimento]

---

## 🙏 Agradecimentos

- Embrapa Soja - Base de conhecimento técnico
- SENAR - Informações sobre armazenagem
- CONAB - Dados de classificação de grãos
- Comunidade do agronegócio brasileiro

---

## 📸 Screenshots

### Tela de Cadastro
![Cadastro](docs/screenshots/cadastro.png)

### Assistente Conversacional
![Assistente](docs/screenshots/assistente.png)

### Calculadoras
![Calculadoras](docs/screenshots/calculadoras.png)

### Aba de Compras
![Compras](docs/screenshots/compras.png)

---

**Desenvolvido com ❤️ para o agronegócio brasileiro**

🌾 **Central do Grão** - Sua referência em armazenagem de grãos

