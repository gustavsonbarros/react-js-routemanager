// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Route Manager Pro
        </Link>
        
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/clientes" className="navbar-link">
              Clientes
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/encomendas" className="navbar-link">
              Encomendas
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/rotas" className="navbar-link">
              Rotas
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/entregas" className="navbar-link">
              Entregas
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/rastreamento" className="navbar-link">
              Rastreamento
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}