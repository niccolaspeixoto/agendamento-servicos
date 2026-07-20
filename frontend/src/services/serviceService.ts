import { API_URL } from "./api"; //importa a api
import type { Service } from "../types/service"; // importa o service

export async function getServices(): Promise<Service[]> { // é uma promisse que quando resolvida, entrega um array de Service.
  const response = await fetch(`${API_URL}/services`);

  if (!response.ok) {
    throw new Error("Erro ao buscar serviços");
  }

  return response.json();
}