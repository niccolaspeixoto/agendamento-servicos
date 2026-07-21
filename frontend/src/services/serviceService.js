import { API_URL } from "./api";

//função para listar os serviços
export async function getServices() {
  const response = await fetch(`${API_URL}/services`);

  if (!response.ok) {
    throw new Error("Erro ao buscar serviços");
  }

  return response.json();
}