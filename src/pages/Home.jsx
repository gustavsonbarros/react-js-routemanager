import { FiTruck, FiUsers, FiPackage, FiBarChart2, FiArrowRight, FiCheckCircle, FiMap, FiClock, FiDollarSign } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Route Manager Pro</h1>
          <p className="hero-subtitle">Solução completa para otimização logística e gestão de entregas com inteligência artificial</p>
          
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
            
            <div className="stat-card">
              <div className="stat-icon">
                <FiCheckCircle />
              </div>
              <div className="stat-text">
                <span className="stat-number">98%</span>
                <span className="stat-label">taxa de sucesso</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Nossas Soluções Integradas</h2>
          <p>Tecnologia avançada para simplificar sua operação logística e reduzir custos</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="card-icon">
              <FiUsers size={28} />
            </div>
            <h3>Gestão de Clientes</h3>
            <p>Controle completo de cadastros, histórico de pedidos e informações de contato em um só lugar com relatórios personalizados.</p>
            <Link to="/clientes" className="feature-link">
              Acessar módulo <FiArrowRight />
            </Link>
          </div>
          
          <div className="feature-card">
            <div className="card-icon">
              <FiPackage size={28} />
            </div>
            <h3>Controle de Encomendas</h3>
            <p>Monitoramento em tempo real do ciclo completo das entregas, do pedido à entrega, com alertas automáticos.</p>
            <Link to="/encomendas" className="feature-link">
              Gerenciar encomendas <FiArrowRight />
            </Link>
          </div>
          
          <div className="feature-card">
            <div className="card-icon">
              <FiMap size={28} />
            </div>
            <h3>Otimização de Rotas</h3>
            <p>Algoritmos inteligentes para calcular as melhores rotas, reduzindo tempo e custos de entrega.</p>
            <Link to="/rotas" className="feature-link">
              Planejar rotas <FiArrowRight />
            </Link>
          </div>
          
          <div className="feature-card">
            <div className="card-icon">
              <FiBarChart2 size={28} />
            </div>
            <h3>Business Intelligence</h3>
            <p>Relatórios analíticos e dashboards interativos para tomada de decisão baseada em dados.</p>
            <Link to="/dashboard" className="feature-link">
              Ver análises <FiArrowRight />
            </Link>
          </div>
          
          <div className="feature-card">
            <div className="card-icon">
              <FiClock size={28} />
            </div>
            <h3>Rastreamento em Tempo Real</h3>
            <p>Acompanhamento geolocalizado de todas as entregas com atualizações automáticas.</p>
            <Link to="/rastreamento" className="feature-link">
              Rastrear entregas <FiArrowRight />
            </Link>
          </div>
          
          <div className="feature-card">
            <div className="card-icon">
              <FiDollarSign size={28} />
            </div>
            <h3>Gestão Financeira</h3>
            <p>Controle de custos operacionais, faturas e recebimentos integrado ao fluxo de entregas.</p>
            <Link to="/financeiro" className="feature-link">
              Acessar financeiro <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>O que nossos clientes dizem</h2>
          <p>Empresas que confiam em nossa solução para sua operação logística</p>
        </div>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"Reduzimos 30% nos custos de entrega após implementar o Route Manager Pro. A otimização de rotas foi um divisor de águas."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">JS</div>
              <div className="author-info">
                <strong>João Silva</strong>
                <span>CEO, Transportes Fast</span>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"A visibilidade completa do processo de entrega nos permitiu melhorar significativamente a satisfação dos clientes."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">MC</div>
              <div className="author-info">
                <strong>Maria Costa</strong>
                <span>Gerente de Logística, E-Commerce BR</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Pronto para revolucionar sua logística?</h2>
          <p>Comece agora e experimente a transformação na sua operação de entregas com nossa plataforma completa</p>
          <div className="cta-buttons">
            <Link to="/demo" className="cta-button primary">
              Agendar Demonstração
            </Link>
            <Link to="/cadastro" className="cta-button secondary">
              Criar Conta Gratuita
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Route Manager Pro - Todos os direitos reservados</p>
          <div className="footer-links">
            <Link to="/termos">Termos de Serviço</Link>
            <Link to="/privacidade">Política de Privacidade</Link>
            <Link to="/contato">Contato</Link>
          </div>
          <p className="footer-developer">Desenvolvido por Gustavson Barros</p>
        </div>
      </footer>
    </div>
  );
}