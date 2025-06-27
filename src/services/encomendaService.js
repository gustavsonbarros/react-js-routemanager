// encomendaService.js
const API_URL = "http://localhost:3001/encomendas"; 

export async function listarEncomendas() {
  try {
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error("Erro ao carregar encomendas");
    return await resp.json();
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
}