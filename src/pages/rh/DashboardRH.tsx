import { Link } from 'react-router-dom';
import LatestQuestionnaires from '@/components/LatestQuestionnaires'; // Importando o componente das últimas vagas

export default function DashboardRH() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard RH</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Botões para as ações principais */}
        
        {/* Cadastrar Vaga */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
          <h2 className="text-xl font-semibold mb-4">Cadastrar Vaga</h2>
          <p>Crie novas vagas para os candidatos se inscreverem.</p>
          <Link to="/rh/questionnaires/create" className="text-blue-600 hover:underline mt-4 block">
            Acessar
          </Link>
        </div>




                {/* Cadastrar Candidato */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
          <h2 className="text-xl font-semibold mb-4">Cadastrar Candidato</h2>
          <p>Adicione candidatos manualmente ao sistema.</p>
          <Link to="/rh/candidates" className="text-blue-600 hover:underline mt-4 block">
  Acessar
</Link>
        </div>

        {/* Outros botões de funcionalidades */}
        {/* ... */}
      </div>

      {/* Seção das últimas 5 vagas */}
      <LatestQuestionnaires />
    </div>
  );
}
