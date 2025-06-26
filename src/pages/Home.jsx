import { FiTruck, FiUsers, FiPackage, FiBarChart2, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Route Manager Pro</h1>
          <p className="hero-subtitle">Solução completa para otimização logística e gestão de entregas</p>
          
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <FiTruck />
              </div>
              <div className="stat-text">
                <span className="stat-number">+1.200</span>
                <span className="stat-label">entregas/mês</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <FiUsers />
              </div>
              <div className="stat-text">
                <span className="stat-number">+350</span>
                <span className="stat-label">clientes ativos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Nossas Soluções Integradas</h2>
          <p>Tecnologia avançada para simplificar sua operação logística</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="card-icon">
              <FiUsers size={28} />
            </div>
            <h3>Gestão de Clientes</h3>
            <p>Controle completo de cadastros, histórico de pedidos e informações de contato em um só lugar.</p>
            <Link to="/clientes" className="feature-link">
              Acessar módulo <FiArrowRight />
            </Link>
          </div>
          
          <div className="feature-card">
            <div className="card-icon">
              <FiPackage size={28} />
            </div>
            <h3>Controle de Encomendas</h3>
            <p>Monitoramento em tempo real do ciclo completo das entregas, do pedido à entrega.</p>
            <Link to="/encomendas" className="feature-link">
              Gerenciar encomendas <FiArrowRight />
            </Link>
          </div>
          
          <div className="feature-card">
            <div className="card-icon">
              <FiBarChart2 size={28} />
            </div>
            <h3>Business Intelligence</h3>
            <p>Relatórios analíticos e dashboards para tomada de decisão baseada em dados.</p>
            <button className="feature-link coming-soon" disabled>
              Em breve <FiArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Pronto para revolucionar sua logística?</h2>
          <p>Comece agora e experimente a transformação na sua operação de entregas</p>
          <div className="cta-buttons">
            <Link to="/clientes" className="cta-button primary">
              Cadastrar primeiro cliente
            </Link>
            <Link to="/encomendas" className="cta-button secondary">
              Registrar nova encomenda
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Route Manager Pro - Todos os direitos reservados</p>
          <p className="footer-developer">Desenvolvido por Gustavo Barros</p>
        </div>
      </footer>
    </div>
  );
}