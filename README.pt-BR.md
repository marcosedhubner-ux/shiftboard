# ShiftBoard

Agendamento de equipe multi-tenant para negócios de serviço — salões, clínicas, estúdios, qualquer coisa reservada por cadeira ou por horário. Cada negócio tem seu próprio espaço isolado; cada reserva é conferida contra a agenda daquele profissional antes de poder ser salva.

[Read in English](./README.md)

## Por que esse projeto existe

A parte interessante de um sistema de agendamento não é a interface do calendário — é garantir que dois clientes nunca acabem marcados com o mesmo profissional no mesmo horário, e garantir que essa regra se mantenha mesmo quando duas requisições competem entre si. Esse projeto foi construído em torno dessa garantia, além do segundo problema que todo SaaS de agendamento precisa resolver desde o primeiro dia: **isolamento entre clientes (tenants)**. Toda tabela, toda query e todo evento em tempo real são filtrados por `tenantId`, e esse filtro é aplicado na camada de serviço — nunca deixado por conta do cliente acertar.

## Arquitetura

```
apps/
  web/   Next.js 16 (App Router, TypeScript, Tailwind) — agenda, equipe, serviços, dashboard
  api/   Node/Express (TypeScript) — API REST + Socket.IO, Prisma ORM, PostgreSQL
```

```
src/
  domain/              appointmentConflict.ts — lógica pura de sobreposição de intervalos, sem framework, testada
                        errors.ts — erros de domínio tipados, mapeados para códigos HTTP
  modules/<nome>/      <nome>.schema.ts    validação de entrada com Zod
                        <nome>.service.ts   regra de negócio, queries do Prisma filtradas por tenant
                        <nome>.repository.ts (appointments — vale a pena ler a camada de query)
                        <nome>.routes.ts    router do Express, controllers finos
  middlewares/         autenticação, checagem de papel, rate limiting, tratamento central de erro
  realtime/            salas do Socket.IO — uma sala por tenant, só entra depois de validar o token da sessão
```

## A checagem de conflito

Ao reservar um horário, o sistema calcula o `endTime` a partir da duração do serviço, busca todos os agendamentos não cancelados daquele profissional no mesmo dia, e testa cada um contra `rangesOverlap` (`src/domain/appointmentConflict.ts`). Qualquer sobreposição — total ou parcial — rejeita a reserva com um `409` nomeando exatamente o horário conflitante, antes de qualquer escrita no banco. Essa mesma função pura é testada diretamente em `tests/appointmentConflict.test.ts`, então a regra é verificada independente do Express, do Prisma ou do HTTP.

## Multi-tenancy e segurança

- Toda tabela que não é o próprio tenant carrega uma coluna `tenantId`, e toda query filtra por ela — uma requisição do tenant A nunca consegue ler ou escrever a equipe, os serviços ou os agendamentos do tenant B, mesmo adivinhando um ID que pareça válido.
- Senhas com hash via bcrypt (fator de custo 12); sessões são JWTs (carregando `userId`, `tenantId`, `role`) em cookies `httpOnly` e `sameSite=lax`.
- A checagem de papel (`OWNER` / `ADMIN` / `STAFF`) é aplicada na camada de serviço, não só escondida na interface — um admin tentando promover alguém a admin, ou um staff tentando cancelar o agendamento de um colega, é rejeitado com `403` pela própria API (veja `staff.service.ts` e `appointments.service.ts`).
- Eventos em tempo real seguem o mesmo isolamento: conexões Socket.IO só entram na sala do seu tenant depois que o cookie de sessão é validado, então um negócio nunca vê as atualizações ao vivo de outro.
- Toda entrada é validada com Zod na borda da aplicação; o Prisma parametriza todas as queries.
- Rate limiting nos endpoints de autenticação, cabeçalhos de segurança via `helmet`, CORS restrito à origem configurada do frontend.
- Nenhum segredo fica versionado no repositório — veja [Como rodar](#como-rodar).

## Como rodar

### Pré-requisitos

- Node.js 20+
- Uma instância de PostgreSQL 14+ (local ou hospedada)

### 1. Configurar a API

```bash
cd apps/api
cp .env.example .env
```

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | String de conexão do PostgreSQL |
| `JWT_SECRET` | String aleatória, 32+ caracteres (`openssl rand -hex 32`) |
| `WEB_ORIGIN` | URL do frontend, para o CORS (`http://localhost:3001` em dev) |

```bash
npm install
npm run prisma:migrate   # cria o schema
npm run prisma:seed      # tenant, equipe e serviços de demonstração
npm run dev              # http://localhost:4001
```

Contas de demonstração criadas pelo seed, todas no mesmo tenant (senha `Passw0rd!123`):

| Papel | Email |
| --- | --- |
| Dono(a) | `owner@shiftboard.dev` |
| Admin | `admin@shiftboard.dev` |
| Staff | `stylist1@shiftboard.dev` |

### 2. Configurar o frontend

```bash
cd apps/web
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL
npm install
npm run dev -- -p 3001             # http://localhost:3001
```

## Testes

```bash
cd apps/api
npm test        # testes unitários da detecção de conflito de horário (Vitest)
```

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS · TanStack Query · Node.js · Express · Socket.IO · Prisma · PostgreSQL · Zod · Vitest
