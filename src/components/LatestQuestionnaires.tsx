import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integration/supabase/client"; // Certifique-se de que o supabase está configurado corretamente

const LatestQuestionnaires = () => {
  const [questionnaires, setQuestionnaires] = useState<any[]>([]); // Estado para armazenar as vagas
  const [loading, setLoading] = useState(true);

  // Função para buscar as últimas 5 vagas
  const fetchQuestionnaires = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("questionnaires")
      .select("*") // Seleciona todos os campos (ajuste conforme necessário)
      .eq("status", "active") // Filtra as vagas ativas
      .order("created_at", { ascending: false }) // Ordena pela data de criação (decrescente)
      .limit(5); // Limita a busca para 5 vagas

    if (error) {
      console.error("Erro ao carregar vagas: ", error.message);
    } else {
      setQuestionnaires(data); // Atualiza o estado com as vagas
    }
    setLoading(false);
  };

  // Chama a função ao carregar o componente
  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
      <h2 className="text-xl font-semibold mb-4">Últimas Vagas Cadastradas</h2>
      {loading ? (
        <p>Carregando vagas...</p>
      ) : questionnaires.length === 0 ? (
        <p>Não há vagas cadastradas no momento.</p>
      ) : (
        <ul className="space-y-4">
          {questionnaires.map((questionnaire) => (
            <li key={questionnaire.id} className="p-4 border rounded">
              <h3 className="font-semibold">{questionnaire.name}</h3>
              <p>{questionnaire.description}</p>
              <Link
                to={`/rh/questionnaires/${questionnaire.id}`}
                className="text-blue-600 hover:underline mt-4 block"
              >
                Ver detalhes
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Botão para ver mais vagas */}
      <div className="mt-4">
        <Link to="/rh/questionnaires" className="text-blue-600 hover:underline">
          Ver mais vagas
        </Link>
      </div>
    </div>
  );
};

export default LatestQuestionnaires;
