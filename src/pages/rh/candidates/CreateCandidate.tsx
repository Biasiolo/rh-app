import { useState } from "react";
import { supabase } from "@/integration/supabase/client"; // Certifique-se de que o Supabase está configurado corretamente
import { useNavigate } from "react-router-dom";

const CreateCandidate = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState(""); //  para criar o usuário
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !email || !phone || !password) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setIsLoading(false);
      return;
    }

    try {
      // Cria a autenticação no Supabase
      const { data, error: authError } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: name,
      role: "candidate",
    },
  },
});

      if (authError) {
        setError("Erro ao criar usuário: " + authError.message);
        setIsLoading(false);
        return;
      }

      // Verifica se o usuário foi criado com sucesso
      const user = data?.user;
      if (!user?.id || !user.email) {
        setError("Erro: Não foi possível criar o usuário.");
        setIsLoading(false);
        return;
      }

      // Garantir que `email` e `id` não sejam undefined
      const candidateData = {
        id: user.id,
        email: user.email || "",  // Garantir que o email não seja undefined
        full_name: name,
        phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Inserir dados na tabela profile
      const { error: profileError } = await supabase.from("profiles").insert([candidateData]);

      if (profileError) {
        setError("Erro ao criar o perfil do candidato: " + profileError.message);
        setIsLoading(false);
        return;
      }

      alert("Candidato cadastrado com sucesso!");
      navigate("/rh/dashboard"); // Redireciona para o Dashboard após o cadastro
    } catch (err) {
      console.error(err);
      setError("Erro inesperado ao cadastrar o candidato.");
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Cadastrar Candidato</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-lg">Nome</label>
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
          <label htmlFor="email" className="block text-lg">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-lg">Telefone</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>



        <div>
          <label htmlFor="password" className="block text-lg">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
          disabled={isLoading}
        >
          {isLoading ? "Cadastrando..." : "Cadastrar Candidato"}
        </button>
      </form>
    </div>
  );
};

export default CreateCandidate;
