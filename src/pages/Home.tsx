// src/pages/Home.tsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Bem-vindo ao sistema de Candidaturas</h1>
      <div className="space-y-4">
        <p>Escolha uma das opções abaixo para acessar o login:</p>
        <div className="space-y-2">
          <Link to="/login/candidate" className="text-blue-600 hover:underline">
            Login Candidato
          </Link>
          <hr></hr>
          <Link to="/login/hr" className="text-blue-600 hover:underline">
            Login RH/Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
