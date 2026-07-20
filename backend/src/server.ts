import express from "express"; //importa a biblioteca express(lida com rotas HTTP e devolve respostas).
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";

import { createAppointmentSchema } from "./schemas/appointment.schema.js";

const app = express(); //cria a aplicação para podermos utilizar
app.use(express.json());// traduz a requisição em json
app.use(cors());//permite req e res de portas ou caminhos diferentes. Sem ele, o navegador bloquaria.


//rota para listar os serviços disponíveis
app.get("/services", async (req, res) => {
  const services = await prisma.service.findMany();
  res.json(services);
});

//rota para criar o agendamento
app.post("/appointments", async (req, res) => {
  const result = createAppointmentSchema.safeParse(req.body); // .safeParse() -> sempre devolve um objeto com o resultado, dando pra decidir o que fazer sem precisar de tratamento de erro "brusco".

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }

  // a lógica de criar o agendamento
  try {
    const appointment = await prisma.appointment.create({
      data: {
        ...result.data,
        date: new Date(result.data.date)
      }
    });

    return res.status(201).json(appointment);
  } catch (error) {

    if (
      error instanceof Prisma.PrismaClientKnownRequestError && // o instanceof checa se esse erro específico é do tipo que o Prisma usa pra erros conhecidos vindos do banco 
      error.code === "P2002" // cada tipo de erro conhecido do Prisma tem um código próprio. P2002 especificamente significa "violação de constraint única", exatamente o cenário do nosso @@unique([date, time])
    ) {
      return res.status(409).json({ // 409 -> "sua requisição é válida, mas conflita com o estado atual dos dados"
        error: "Esse horário já está ocupado. Escolha outro horário.",
      });
    }

    return res.status(500).json({ error: "Erro ao criar agendamento" });
  }
});





const PORT = process.env.PORT || 3000;//se nao rodar na porta de ambiente do servidor, pode rodar na 3000 local.

//app rodando na porta 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`);
});

