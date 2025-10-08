# 🚗 Habilitado Via 240

Sistema backend desenvolvido com **NestJS**, **Prisma ORM** e **SQLite**, voltado para o gerenciamento de **aulas e pagamentos** de condutores já habilitados (categorias B e D).

---

## 🧱 Tecnologias principais

- [NestJS](https://nestjs.com/) — estrutura modular para Node.js
- [Prisma ORM](https://www.prisma.io/) — mapeamento de dados e acesso ao banco
- [SQLite](https://www.sqlite.org/) — banco leve para uso local
- [TypeScript](https://www.typescriptlang.org/)
- [Class-Validator](https://github.com/typestack/class-validator) — validação de DTOs

---

## ⚙️ Estrutura do projeto

habilitado_via_240/
├── prisma/ # Schema e migrações do Prisma
│ ├── schema.prisma
│ └── dev.db
│
├── src/
│ ├── prisma/ # Serviço e módulo Prisma
│ ├── auth/ # Login via senha do .env
│ ├── aluno/ # CRUD de alunos
│ ├── aula/ # CRUD de aulas + rota "Aulas de Hoje"
│ ├── pagamento/ # CRUD de pagamentos
│ └── main.ts # Ponto de entrada do NestJS
│
├── .env # Configurações de ambiente
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md


---

## 🚀 Como rodar o projeto localmente

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/seu-usuario/habilitado_via_240.git
cd habilitado_via_240


2️⃣ Instalar dependências
npm install

3️⃣ Configurar o arquivo .env

Crie um arquivo .env na raiz e adicione:

APP_PASSCODE=
DATABASE_URL=

4️⃣ Gerar o banco SQLite
npx prisma migrate dev --name init

5️⃣ Rodar o servidor em modo de desenvolvimento
npm run start:dev

