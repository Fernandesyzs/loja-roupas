
import { staticProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import { listarProdutos } from '../service/produtoService';
import { useEffect, useState } from 'react';
// Endereço do backend que disponibiliza as imagens.
const API_IMAGENS = 'http://localhost:8080/imagens/';

// Imagem exibida quando o produto ainda não possui foto.
const IMAGEM_PADRAO = '/Imagem/placeholder.svg';

export default function Home() {
  // Guarda os produtos recebidos do banco de dados.
  const [products, setProducts] = useState([]);

  // Controla a mensagem de carregamento.
  const [loading, setLoading] = useState(true);

  // Guarda possíveis erros na consulta à API.
  const [error, setError] = useState('');

  // Guarda o nome do último produto adicionado ao carrinho.
  const [justAdded, setJustAdded] = useState('');

  // Obtém a função de adicionar produtos ao carrinho.
  const { addItem } = useCart();

  // Busca os produtos quando a página é carregada.
  useEffect(() => {
    async function carregarProdutos() {
      try {
        setLoading(true);
        setError('');

        // Consulta o backend Spring Boot.
        const dados = await listarProdutos();

        // Transforma os dados do banco no formato usado pela tela.
        const produtosFormatados = dados.map((produto) => {
          // Procura dados antigos do mesmo produto, se existirem.
          const produtoAntigo = staticProducts.find(
            (item) => Number(item.id) === Number(produto.id)
          );

          // Lê o nome do arquivo de imagem retornado pela API.
          const nomeImagem = produto.imagem?.caminho;

          // Converte o preço recebido do banco em número.
          const preco = Number(produto.preco);

          return {
            ...produto,

            // Mantém os nomes esperados pelo carrinho e pela tela.
            name: produto.nome,
            price: preco,

            // Mantém os valores antigos quando houver correspondência.
            pricePix: produtoAntigo?.pricePix ?? preco,
            installment:
              produtoAntigo?.installment ?? preco / 4,

            // Monta a URL da imagem associada ao produto.
            image: nomeImagem
              ? `${API_IMAGENS}${encodeURIComponent(nomeImagem)}`
              : produtoAntigo?.image ?? IMAGEM_PADRAO,
          };
        });

        setProducts(produtosFormatados);
      } catch (erro) {
        console.error('Erro ao carregar produtos:', erro);
        setError('Não foi possível carregar os produtos.');
      } finally {
        setLoading(false);
      }
    }

    carregarProdutos();
  }, []);

  // Adiciona um produto ao carrinho.
  function handleAdd(product) {
    addItem(product);

    setJustAdded(product.name);

    // Cancela o temporizador anterior, caso exista.
    window.clearTimeout(handleAdd._t);

    // Esconde a mensagem depois de 2,2 segundos.
    handleAdd._t = window.setTimeout(() => {
      setJustAdded('');
    }, 2200);
  }

  // Formata valores monetários no padrão brasileiro.
  function formatarPreco(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <main>
      {/* Benefícios apresentados na página inicial. */}
      <section
        className="py-5"
        style={{ backgroundColor: 'var(--secondary-color)' }}
      >
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4 mb-md-0">
              <i className="bi bi-truck fs-3 mb-2 d-block"></i>
              <h5>FRETE GRÁTIS</h5>
              <p className="text-muted mb-0">
                Para compras acima de R$238,90
              </p>
            </div>

            <div className="col-md-4 mb-4 mb-md-0">
              <i className="bi bi-percent fs-3 mb-2 d-block"></i>
              <h5>10% OFF NA PRIMEIRA COMPRA</h5>
              <p className="text-muted mb-0">
                Use o cupom "GUETOSL10"
              </p>
            </div>

            <div className="col-md-4">
              <i className="bi bi-credit-card fs-3 mb-2 d-block"></i>
              <h5>ATÉ 4X SEM JUROS</h5>
              <p className="text-muted mb-0">Em todo site</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lista de produtos carregados do banco de dados. */}
      <section id="colecao" className="container my-5">
        <h2 className="section-title">DISPONÍVEL AGORA</h2>

        {loading && (
          <p className="text-center">Carregando produtos...</p>
        )}

        {!loading && error && (
          <p className="text-center text-danger">{error}</p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-center">
            Nenhum produto cadastrado.
          </p>
        )}

        <div className="row">
          {products.map((product) => (
            <div className="col-md-4" key={product.id}>
              <div className="card border-0 shadow-sm mb-4 h-100 product-card">
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.name}
                  style={{
                    height: '340px',
                    objectFit: 'cover',
                  }}
                  onError={(evento) => {
                    // Evita repetir a tentativa se o placeholder falhar.
                    if (evento.currentTarget.src.endsWith(IMAGEM_PADRAO)) {
                      evento.currentTarget.onerror = null;
                      return;
                    }

                    evento.currentTarget.src = IMAGEM_PADRAO;
                  }}
                />

                <div className="card-body text-center d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>

                  <p className="fw-bold mb-0">
                    R${formatarPreco(product.price)}
                  </p>

                  <p
                    className="mb-0"
                    style={{ color: 'var(--accent-color)' }}
                  >
                    R${formatarPreco(product.pricePix)} com Pix
                  </p>

                  <p className="text-muted small">
                    4x de R${formatarPreco(product.installment)} sem juros
                  </p>

                  <button
                    type="button"
                    className="btn btn-dark mt-auto w-100"
                    onClick={() => handleAdd(product)}
                  >
                    Comprar <i className="bi bi-cart-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mensagem temporária após adicionar um produto ao carrinho. */}
      <div
        className={`position-fixed bottom-0 start-50 translate-middle-x mb-4 px-4 py-2 text-white rounded ${
          justAdded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundColor: 'var(--primary-color)',
          transition: 'opacity 0.25s ease',
          zIndex: 1050,
          pointerEvents: 'none',
        }}
        role="status"
      >
        {justAdded && `${justAdded} adicionado ao carrinho`}
      </div>
    </main>
  );
}