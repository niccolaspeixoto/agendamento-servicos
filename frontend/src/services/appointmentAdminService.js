import { API_URL } from "./api";
import { getToken } from "../utils/auth";

export async function getAllAppointments() {
  const response = await fetch(`${API_URL}/appointments`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar agendamentos");
  }

  return response.json();
}

export async function updateAppointmentStatus(id, status) {
  const response = await fetch(`${API_URL}/appointments/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar status");
  }

  return response.json();
}

export async function deleteAppointment(id) {
  const response = await fetch(`${API_URL}/appointments/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir agendamento");
  }
}