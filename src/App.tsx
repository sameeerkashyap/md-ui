import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MolecularDynamicsBlueprint from './pages/MolecularDynamicsBlueprint';
import './App.css';
import MolecularDynamicsPlayground from './pages/MolecularDynamicsPlayground';


function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
        <p className="mt-4">
          <Link to="/md" className="text-emerald-400 hover:text-emerald-300 underline font-bold text-xl">
            ▶ Launch Molecular Simulation
          </Link>
        </p>
        <p className="mt-2">
          <Link to="/md-sample" className="text-blue-400 hover:text-blue-300 underline text-sm">
            View Blueprint Guide
          </Link>
        </p>
      </header>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/md" element={<MolecularDynamicsPlayground />} />
        <Route path="/md-sample" element={<MolecularDynamicsBlueprint />} />
      </Routes>
    </Router>
  );
}

export default App;
