
const API_URL = "http://localhost:8080/produtos";

// Busca a lista de produtos disponibilizada pelo backend.
export async function listarProdutos() {
    const resposta = await fetch(API_URL);

    // Interrompe a operação se a API responder com erro HTTP.
    if (!resposta.ok) {
        throw new Error(
            `Erro ao buscar produtos: HTTP ${resposta.status}`
        );
    }

    // Converte o JSON recebido em dados que o JavaScript consegue usar.
    return await resposta.json();
}