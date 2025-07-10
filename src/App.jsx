
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import Encomendas from './pages/Encomendas';
import Rastreamento from './pages/Rastreamento';
import Rotas from './pages/Rotas';
import Entregas from './pages/Entregas';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/encomendas" element={<Encomendas />} />
            <Route path="/rastreamento" element={<Rastreamento />} />
            <Route path="/rotas" element={<Rotas />} />
            <Route path="/entregas" element={<Entregas />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;