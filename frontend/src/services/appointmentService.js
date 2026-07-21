import { API_URL } from "./api";


//buscando horarios disponiveis
export async function getAvailableSlots(date) {
  const response = await fetch(`${API_URL}/appointments/available?date=${date}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar horários disponíveis");
  }

  return response.json();
}


//agendando horario
export async function createAppointment(data) {
  const response = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Erro ao criar agendamento");
  }

  return result;
}