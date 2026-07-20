import express from "express"; //importa a biblioteca express(lida com rotas HTTP e devolve respostas).
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";

import { createAppointmentSchema } from "./schemas/appointment.schema.js";

const app = express(); //cria a aplicação para podermos utilizar
app.use(express.json());// traduz a requisição em json
app.use(cors());//permite req e res de portas ou caminhos diferentes. Sem ele, o navegador bloquaria.

const BUSINESS_HOURS = { start: 9, end: 18 };// horarios

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

//rota para listar os horarios de agendamentos disponiveis
app.get("/appointments/available", async (req, res) => {
  const { date } = req.query;

  if (typeof date !== "string") {
    return res.status(400).json({ error: "Parâmetro 'date' é obrigatório" });
  }

  const allSlots: string[] = [];
  for (let hour = BUSINESS_HOURS.start; hour < BUSINESS_HOURS.end; hour++) {
    allSlots.push(`${hour.toString().padStart(2, "0")}:00`); // .padStart(2, "0") garante que sempre tenha 2 dígitos, preenchendo com 0 à esquerda se precisar
  }

  const bookedAppointments = await prisma.appointment.findMany({
    where: { //localiza em especifico.
      date: new Date(date), //filtra pela data específica que veio na url.
      status: { not: "CANCELADO" }, //ele tira de visualização dos horarios agendados, assim deixando em horario livre.
    },
    select: { time: true }, //pedindo para ele trazer somente o campo time, para a aplicação ficar mais rápida e leve.
  });


  const bookedTimes = bookedAppointments.map((appointment) => appointment.time); // ele está mapeando o array de appointment e trazendo os horários.
  const availableSlots = allSlots.filter((slot) => !bookedTimes.includes(slot)); //ele está filtrando o array de horários e trazendo somente os disponiveis.

  return res.json(availableSlots);
});





const PORT = process.env.PORT || 3000;//se nao rodar na porta de ambiente do servidor, pode rodar na 3000 local.

//app rodando na porta 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`);
});

