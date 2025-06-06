import { Link } from "react-router-dom";
import { Truck, Users, Package, BarChart2 } from "react-feather";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Route Manager</h1>
          <p className="subtitle">Solução completa para gestão de entregas e rotas logística</p>
          <div className="hero-stats">
            <div className="stat-item">
              <Truck className="stat-icon" />
              <span>+500 entregas/mês</span>
            </div>
            <div className="stat-item">
              <Users className="stat-icon" />
              <span>+200 clientes</span>
            </div>
          </div>
        </div>
      </header>

      <section className="features-section">
        <h2 className="section-title">Nossas Soluções</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="card-icon">
              <Users size={32} />
            </div>
            <h3>Gestão de Clientes</h3>
            <p>Cadastro completo com histórico de pedidos e informações de contato.</p>
            <Link to="/clientes" className="action-button">
              Acessar Clientes
            </Link>
          </div>

          <div className="feature-card">
            <div className="card-icon">
              <Package size={32} />
            </div>
            <h3>Controle de Encomendas</h3>
            <p>Monitoramento completo do ciclo de vida das entregas.</p>
            <Link to="/encomendas" className="action-button">
              Gerenciar Encomendas
            </Link>
          </div>

          <div className="feature-card">
            <div className="card-icon">
              <BarChart2 size={32} />
            </div>
            <h3>Relatórios Avançados</h3>
            <p>Dados analíticos para melhor tomada de decisão.</p>
            <button className="action-button disabled" disabled>
              Em Breve
            </button>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Pronto para otimizar sua logística?</h2>
        <p>Comece agora e transforme sua operação de entregas</p>
        <div className="cta-buttons">
          <Link to="/clientes" className="cta-button primary">
            Cadastrar Cliente
          </Link>
          <Link to="/encomendas" className="cta-button secondary">
            Nova Encomenda
          </Link>
        </div>
      </section>

      <footer className="main-footer">
        <div className="footer-content">
          <p>© Desenvolvido por Gustavson Barros - 2025 Route Manager - Todos os direitos reservados</p>
          <div className="footer-links">
            <Link to="/termos">Termos</Link>
            <Link to="/privacidade">Privacidade</Link>
            <Link to="/contato">Contato</Link>
          </div>
        </div>
      </footer>
      
    </div>
  );
}