# Agenda API - Processo Seletivo

CRUD completo para agenda de contatos desenvolvido em .NET 8 (backend) e Vue.js 3 + PrimeVue (frontend).

## 🚀 Funcionalidades

### Backend (.NET 8)
- ✅ **CRUD Completo** - Create, Read, Update, Delete de contatos
- ✅ **Autenticação JWT** - Sistema seguro com tokens
- ✅ **Validações** - FluentValidation com regras de negócio
- ✅ **Padrão CQRS** - MediatR para separação de concerns
- ✅ **Entity Framework** - ORM com SQLite InMemory
- ✅ **AutoMapper** - Mapeamento entre DTOs e entidades
- ✅ **Swagger** - Documentação interativa da API
- ✅ **Testes Unitários** - xUnit + Moq com alta cobertura
- ✅ **Docker** - Containerização completa

### Frontend (Vue.js 3 + PrimeVue)
- ✅ **Interface Responsiva** - Design moderno com PrimeVue
- ✅ **Componentização** - Arquitetura componentizada e reutilizável
- ✅ **Gestão de Estado** - Pinia para state management
- ✅ **TypeScript** - Tipagem estática completa
- ✅ **Rotas Protegidas** - Navegação segura com autenticação
- ✅ **Formulários Validados** - Validações em tempo real
- ✅ **Testes Componentes** - Vitest para testes de UI

## 🛠️ Tecnologias Utilizadas

### Backend
- .NET 8.0
- Entity Framework Core 8.0
- SQLite InMemory
- JWT Authentication
- FluentValidation
- AutoMapper
- MediatR
- xUnit + Moq
- Swagger/OpenAPI
- Docker

### Frontend
- Vue.js 3
- TypeScript
- PrimeVue
- Pinia
- Vue Router
- Axios
- Vitest
- Vite

## 📋 Requisitos Atendidos

### Obrigatórios
- [x] .NET 6+ backend
- [x] Vue.js frontend  
- [x] Regras de negócio e validações
- [x] Padrões de projeto (Repository, Service, CQRS)
- [x] Entity Framework
- [x] Libs: AutoMapper, FluentValidation, MediatR
- [x] Swagger
- [x] Código organizado
- [x] Testes backend
- [x] Componentes Vue.js

### Diferenciais
- [x] CQRS com MediatR
- [x] Autenticação JWT
- [x] RabbitMQ configurado
- [x] Docker e docker-compose
- [x] Testes frontend


## 🚀 Como Executar

### Pré-requisitos
- .NET 8.0 SDK
- Node.js 18+
- Docker (opcional)

### Backend
```bash
cd AgendaAPI

# Restaurar pacotes
dotnet restore

# Executar aplicação
dotnet run

# Ou com docker
docker build -t agenda-api .
docker run -p 5018:8080 agenda-api
```

### Frontend
```bash
cd AgendaFrontend/agenda-frontend

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Credenciais de Acesso
```bash
Usuário padrão:
-Email: admin@agenda.com
-Senha: Admin@123

Endpoints:
-Frontend: http://localhost:8080
-Backend API: http://localhost:5018
-Swagger: http://localhost:5018/swagger
```