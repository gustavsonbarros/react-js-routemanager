const API_URL = "http://localhost:3000/encomendas"; 

export async function listarEncomendas() {
  const resp = await fetch(API_URL);
  return resp.json();
}

export async function cadastrarEncomenda(data) {
  const resp = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return resp.json();
}
