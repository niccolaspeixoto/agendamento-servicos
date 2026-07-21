export function getNextDays(count) { //count vai receber o valor que o admin liberar na agenda
  const days = []; // array vazio para receber os dias

  for (let i = 0; i < count; i++) {
    const date = new Date(); // pegando a data de hoje
    date.setDate(date.getDate() + i);

    days.push({ // vamos subir os dados para o array
      date: date.toISOString().split("T")[0], // pega a data e transforma em texto para o back entender.
      label: i === 0 ? "Hoje" : date.toLocaleDateString("pt-BR", { weekday: "short" }),// se a contagem estiver em 0, então estamos em hoje. se não, escreva ter, qua, qui, etc.
      dayNumber: date.getDate(), //pega o numero do dia
    });
  }

  return days;
}