import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integration/supabase/client";

const DetailsQuestionnaire = () => {
  const { id } = useParams<{ id: string }>();
  const [questionnaire, setQuestionnaire] = useState<any>(null); // Estado para armazenar o questionário
  const [questions, setQuestions] = useState<any[]>([]); // Estado para armazenar as perguntas
  const [loading, setLoading] = useState(true);

  // Verificando se o id existe antes de fazer a consulta
  useEffect(() => {
    if (!id) {
      alert("ID do questionário não encontrado.");
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);

      // Buscando as informações do questionário
      const { data: questionnaireData, error: questionnaireError } = await supabase
        .from("questionnaires")
        .select("*")
        .eq("id", id)
        .single(); // Buscando um único questionário pelo ID

      if (questionnaireError) {
        console.error("Erro ao carregar o questionário:", questionnaireError.message);
        setLoading(false);
        return;
      }

      setQuestionnaire(questionnaireData);

      // Buscando as perguntas associadas ao questionário
      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .eq("questionnaire_id", id);

      if (questionsError) {
        console.error("Erro ao carregar perguntas:", questionsError.message);
      } else {
        setQuestions(questionsData);
      }

      setLoading(false);
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!questionnaire) {
    return <p>Vaga não encontrada.</p>;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">{questionnaire.name}</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Descrição da Vaga</h2>
        <p>{questionnaire.description}</p>
        <p>Status: {questionnaire.status}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Perguntas Associadas</h2>
        {questions.length === 0 ? (
          <p>Não há perguntas cadastradas para esta vaga.</p>
        ) : (
          <ul className="space-y-4">
            {questions.map((question) => (
              <li key={question.id} className="p-4 border rounded">
                <p className="font-semibold">{question.question_text}</p>
                <div className="space-y-2">
                  {question.options?.map((option: any, idx: number) => (
                    <div key={idx} className="flex justify-between">
                      <span>{option.text}</span>
                      <span>Peso: {option.weight}</span>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={() => window.history.back()}
        className="mt-6 underline text-blue-600 hover:text-blue-800"
      >
        Voltar
      </button>
    </div>
  );
};

export default DetailsQuestionnaire;
