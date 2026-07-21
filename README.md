# Agenda+ — Agendamento de serviços

Aplicação de agendamento de serviços com área do cliente (sem necessidade de login) e área administrativa protegida por autenticação, desenvolvida como desafio técnico do processo seletivo da DevClub.

**Aplicação em produção:** https://agendamento-servicos-three.vercel.app
**API em produção:** https://agendamento-servicos-bk4r.onrender.com
**Repositório:** https://github.com/niccolaspeixoto/agendamento-servicos

> **Nota sobre o backend:** a API está hospedada no plano gratuito do Render, que "dorme" após um período de inatividade. A primeira requisição após esse período pode levar de 30 a 50 segundos para responder, enquanto o servidor é reativado. Requisições seguintes respondem normalmente.

---

## Tecnologias utilizadas

**Backend**
- Node.js + Express — servidor e rotas da API REST
- Prisma ORM (v7) + adapter `@prisma/adapter-pg` — acesso ao banco de dados
- PostgreSQL (hospedado no Neon) — persistência de dados
- Zod — validação de schemas em runtime
- JSON Web Token (`jsonwebtoken`) — autenticação da área administrativa
- bcryptjs — hash de senha do administrador
- CORS, dotenv

**Frontend**
- React + Vite — SPA
- React Router — roteamento, incluindo rota protegida da área administrativa
- React Hook Form + Zod (`@hookform/resolvers`) — formulários e validação
- CSS Modules — estilização com escopo isolado por componente

**Infraestrutura**
- Deploy do frontend: Vercel
- Deploy do backend: Render
- Banco de dados: Neon (PostgreSQL serverless)

O projeto foi desenvolvido inteiramente em **JavaScript**, não TypeScript — uma decisão técnica documentada na seção de decisões, abaixo.

---

## Ferramentas de IA utilizadas durante o desenvolvimento

O desenvolvimento inteiro foi pareado com o **Claude (Anthropic)**, usado de forma ativa e contínua — não apenas como gerador de trechos de código prontos, mas como ferramenta de estudo, revisão e debug, em modo de explicação passo a passo. Alguns exemplos concretos de como a IA foi usada:

- **Modelagem do banco de dados:** discussão sobre por que os dados do cliente ficam embutidos no `Appointment` em vez de existir uma tabela `Client` separada (decisão consciente contra over-engineering, já que o cliente não possui conta).
- **Debug real de configuração:** o Prisma 7 mudou a forma como a `DATABASE_URL` é configurada (migração do `schema.prisma` para `prisma.config.ts`/`.js`, exigindo um adapter `@prisma/adapter-pg` em vez da conexão implícita das versões anteriores). A IA ajudou a diagnosticar o erro de validação do schema e ajustar a configuração corretamente.
- **Correção de bug de regra de negócio:** identifiquei, testando manualmente, que cancelar um agendamento não liberava o horário para um novo cliente. Junto com a IA, avaliei dois caminhos possíveis — um índice único parcial no banco (mais robusto, exige SQL manual na migration) versus uma checagem a nível de aplicação antes da criação (mais simples, com uma janela teórica de corrida) — e optei conscientemente pela segunda opção, dado o prazo do desafio. Essa decisão está documentada abaixo.
- **Migração de TypeScript para JavaScript:** o projeto foi iniciado em TypeScript; no meio do desenvolvimento, avaliei que a curva de aprendizado adicional da tipagem estava comprometendo meu entendimento real do código, e decidi migrar o projeto inteiro para JavaScript puro, removendo a camada de tipos mas mantendo toda a lógica de negócio intacta.
- **Revisão de decisões de escopo:** dado o prazo apertado, priorizei com apoio da IA quais funcionalidades extras (confirmação por WhatsApp, integração com Google Calendar, dashboard com métricas) valiam o tempo de implementação frente aos requisitos obrigatórios do desafio.

A IA não foi usada para gerar o projeto de forma automática e não supervisionada — cada trecho de código foi explicado, testado manualmente por mim (via Thunder Client no backend e testes visuais no frontend) e, em vários pontos, refeito por mim mesmo com orientação, não copiado diretamente.

---

## Instruções para executar o projeto localmente

### Pré-requisitos
- Node.js 18+
- Uma instância PostgreSQL (local ou serviço gerenciado como Neon/Supabase)

### 1. Clonar o repositório
```bash
git clone <url-do-repositorio>
cd agendamento-servicos
```

### 2. Configurar o backend
```bash
cd backend
npm install
```

Crie um arquivo `.env` dentro de `backend/` com o seguinte conteúdo:
```
DATABASE_URL="postgresql://usuario:senha@host/banco?sslmode=require"
JWT_SECRET="uma-string-secreta-qualquer"
```

Rode as migrations e popule o banco com dados iniciais (serviços de exemplo e o usuário administrador):
```bash
npx prisma migrate dev
npx prisma db seed
```

Inicie o servidor:
```bash
npm run dev
```
A API sobe em `http://localhost:3000`.

### 3. Configurar o frontend
Em outro terminal:
```bash
cd frontend
npm install
```

Crie um arquivo `.env` dentro de `frontend/` (opcional em desenvolvimento local, já que a aplicação usa `http://localhost:3000` como padrão):
```
VITE_API_URL=http://localhost:3000
```

Inicie a aplicação:
```bash
npm run dev
```
A aplicação sobe em `http://localhost:5173`.

---

## Credenciais de acesso

A área do cliente **não requer login**.

Para acessar a área administrativa (`/admin/login`):
- **E-mail:** `admin@agenda.com`
- **Senha:** `admin123`

Essas credenciais são criadas automaticamente ao rodar o comando de seed (`npx prisma db seed`).

---

## Decisões técnicas

**JavaScript em vez de TypeScript.** O projeto foi iniciado em TypeScript, mas migrado para JavaScript puro no meio do desenvolvimento. A decisão foi consciente: como esse era meu primeiro contato com TypeScript, a sobrecarga de aprender tipagem, sintaxe de generics e configuração do `tsconfig` simultaneamente aos conceitos de React e Prisma estava comprometendo meu entendimento real da lógica do projeto. Preferi entregar uma aplicação em uma stack que domino com solidez e consigo explicar em detalhe, a um projeto em TypeScript que eu não conseguiria sustentar tecnicamente numa conversa.

**Dados do cliente embutidos no agendamento.** Não existe uma tabela `Client` separada — nome e telefone são campos diretos do model `Appointment`. Como o cliente não possui conta nem histórico de login, criar uma entidade separada adicionaria complexidade sem benefício real (nenhum dado é reaproveitado entre agendamentos diferentes de uma mesma pessoa).

**Prevenção de horário duplicado em duas camadas.** A criação de agendamento primeiro consulta o banco em busca de um conflito de horário (mesma data/hora com status diferente de `CANCELADO`), e só então cria o registro. Essa é a camada principal de proteção. Como segunda camada de defesa, o tratamento de erro de violação de unicidade do Prisma (`P2002`) também é capturado, caso a checagem inicial seja contornada. Avaliei usar um índice único parcial no banco (`WHERE status != 'CANCELADO'`) como alternativa mais robusta e livre de qualquer condição de corrida, mas optei pela checagem em nível de aplicação dado o prazo do desafio — uma evolução possível e documentada aqui para uma versão futura.

**Cálculo de horários disponíveis no backend.** Em vez de o frontend goleiro filtrar horários ocupados a partir de uma lista completa, a rota `GET /appointments/available` já devolve apenas os horários livres, calculados no servidor a partir do horário comercial configurado (9h–18h, intervalos de 1 hora) e dos agendamentos já existentes. Isso evita que o cliente consiga, mesmo manipulando o frontend, selecionar um horário indisponível.

**Autenticação simples com JWT.** A área administrativa é protegida por login com e-mail e senha (hash com bcrypt) e token JWT com expiração de 8 horas. Não há cadastro de novos administradores pela interface — o único usuário administrador é criado via seed, adequado ao escopo de um projeto com um único responsável pelo negócio.

**Filtro por data no frontend.** A listagem de agendamentos no painel administrativo é buscada uma única vez e filtrada no cliente (JavaScript), em vez de reconsultar a API a cada mudança de data. Para o volume de dados esperado neste projeto, essa abordagem é mais simples e responde instantaneamente, sem tráfego de rede adicional. Um projeto com volume alto de agendamentos se beneficiaria de mover esse filtro para uma query no backend.

**Identidade visual diferenciada.** Em vez de seguir o padrão comum de "agendamento para salão de beleza", optei por uma proposta de plataforma de agendamento para prestadores de serviço autônomos de qualquer área (eletricista, personal trainer, professor particular, entre outros), refletida tanto no catálogo de serviços do seed quanto na identidade visual (paleta terracota/areia, tipografia serifada para títulos).

## Possíveis evoluções futuras
- Múltiplos prestadores de serviço com contas independentes (hoje a administração é centralizada em um único usuário)
- Índice único parcial no banco para eliminar por completo a janela teórica de corrida na checagem de horário duplicado
- Integração com Google Calendar na tela de confirmação
