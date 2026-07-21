//o zod funciona como um yup, ele "valida" os dados que está recebendo. Ex: o nome tem que ser string, data no formato de date, etc.

import { z } from "zod";

export const createAppointmentSchema = z.object({ // um objeto dos campos que esperamos receber no formulario.

    clientName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"), //espera receber string, com 3 caracters no minimo e a msg entre aspas é o que o usuario irá receber, caso nao estja correto.

    clientPhone: z.string().regex(/^\d{10,11}$/, "Telefone deve ter 10 ou 11 dígitos"),
     //.regex() é um padrao de busca pra texto. 
     // As barras /.../ marcam o começo e o fim do regex. 
     // "^" marca o começo da string, pedindo pra contar desde o primeiro caractere. 
     // "/d" significa um digito numerico de 0-9. 
     // {10,11} tem que ter entre 10 ou 11 numeros seguidos, sem formatação.
     // $ significa o fim da string, garantindo que tenha apenas numeros, nada de letras, espaços traço no meio, etc.

     serviceId: z.uuid("ID de serviço inválido"), // uuid -> serve para gerar numeros aleatorios, justamnete para id's.

     date: z.iso.date("Data inválida"),// iso.date -> é o formato de ano/mes/dia

     time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido"),
     // ([01]\d|2[0-3]) -> valida a hora. 
     // o "|" significa: "ou". 
     // [01]\d -> um digito 0 ou 1, seguido de qualquer digito(cobre das 00h as 19h). 
     // OU o padrao 2[0-3](o 2 seguido de 0 a 3, cobrindo das 20h as 23h).
     // ":" -> obrigatorio entre hora e numero
     //[0-5]/d -> valida o minuto(0 a 5), seguido de qualquer digito(0-9). Cobre das 00:00 até 23:59
})
.refine( // recebe dois argumentos: true or false, e um objeto de configuração de erro.
    (data) => {
      const appointmentDateTime = new Date(`${data.date}T${data.time}`);// isso junta a data e a hora numa string única no formato AAAA-MM-DDTHH:MM. O T no meio é o separador padrão entre data e hora, e cria um objeto Date do JS a partir disso.

      return appointmentDateTime > new Date(); // compara a data do agendamento com a data atual. Se for no futuro ou presente = true, se for no passado = false.

    }, // esse bloco já é o objeto inteiro validado com todos os dados

    // esse bloco diz o seguinte: se o refine() falhar, indica o erro lá no campo de date. Indicando que há algo errado com a data agendada.
    {
      message: "Não é possível agendar em uma data/horário no passado",
      path: ["date"],
    }

)