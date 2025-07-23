import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integration/supabase/client";

const CreateQuestionnaire = () => {
  const [name, setName] = useState("");
  const [jobType, setJobType] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !jobType || !description) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("Usuário não autenticado!");
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("questionnaires")
        .insert([
          {
            name,
            job_type: jobType,
            description,
            status,
            created_by: user.id,
          },
        ])
        .select()
        .single(); // ← importante para obter o ID da vaga criada

      if (error) {
        alert("Erro ao cadastrar a vaga: " + error.message);
      } else {
        alert("Vaga cadastrada com sucesso! Agora adicione as perguntas.");
        navigate(`/rh/questionnaires/${data.id}/edit`);
      }
    } catch (err) {
      alert("Erro inesperado ao cadastrar a vaga");
      console.error(err);
    }

    setIsLoading(false);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Cadastrar Nova Vaga</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-lg">Nome da Vaga</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="jobType" className="block text-lg">Tipo de Trabalho</label>
          <input
            type="text"
            id="jobType"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-lg">Descrição</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-lg">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
          disabled={isLoading}
        >
          {isLoading ? "Cadastrando..." : "Cadastrar Vaga"}
        </button>
      </form>
    </div>
  );
};

export default CreateQuestionnaire;
