// Path: src/pages/rh/questionnaire/[id]/edit.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integration/supabase/client";

const EditQuestionnaire = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [weights, setWeights] = useState([0, 0, 0, 0]);
  const [isLoading, setIsLoading] = useState(false);

  if (!id) {
    return <p className="text-red-500 p-4">ID da vaga não encontrado.</p>;
  }

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const preparedOptions = options
      .map((text, index) => ({
        text,
        weight: weights[index] || 0,
      }))
      .filter((opt) => opt.text.trim() !== "");

    if (!questionText || preparedOptions.length === 0) {
      alert("Preencha a pergunta e pelo menos uma resposta.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("questions").insert([
        {
          question_text: questionText,
          questionnaire_id: id,
          question_type: "multiple_choice", // ✅ CAMPO OBRIGATÓRIO ADICIONADO
          order_index: 0,  
          options: preparedOptions,
        },
      ]);

      if (error) {
        alert("Erro ao adicionar pergunta: " + error.message);
      } else {
        alert("Pergunta adicionada com sucesso!");
        setQuestionText("");
        setOptions(["", "", "", ""]);
        setWeights([0, 0, 0, 0]);
      }
    } catch (err) {
      console.error(err);
      alert("Erro inesperado.");
    }

    setIsLoading(false);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Editar Questionário</h1>

      <form onSubmit={handleAddQuestion} className="space-y-4">
        <div>
          <label className="block text-lg">Pergunta</label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Digite a pergunta"
            required
          />
        </div>

        <div className="space-y-4">
          <label className="block text-lg">Respostas e Pesos</label>
          {options.map((option, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[idx] = e.target.value;
                  setOptions(newOptions);
                }}
                className="flex-1 px-4 py-2 border rounded-md"
                placeholder={`Resposta ${idx + 1}`}
              />
              <input
                type="number"
                value={weights[idx]}
                onChange={(e) => {
                  const newWeights = [...weights];
                  newWeights[idx] = parseInt(e.target.value) || 0;
                  setWeights(newWeights);
                }}
                className="w-24 px-2 py-2 border rounded-md"
                placeholder="Peso"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : "Adicionar Pergunta"}
        </button>
      </form>

      <button
        onClick={() => navigate("/rh/dashboard")}
        className="mt-6 underline text-blue-600 hover:text-blue-800"
      >
        Voltar para o Dashboard
      </button>
    </div>
  );
};

export default EditQuestionnaire;
