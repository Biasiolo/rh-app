import React, { useState } from 'react';
import { supabase } from '@/integration/supabase/client';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
  closeModal: () => void;
}

const UserSignUpModal: React.FC<ModalProps> = ({ closeModal }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'hr'>('hr'); // Definido para RH ou Admin
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false); // Controle de desbloqueio
  const navigate = useNavigate();

  const handlePasswordCheck = () => {
    if (inputPassword === 'Senha10!') {
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Senha inválida!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Criação do usuário no Supabase Auth
      const { data: signUpData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(`Erro de autenticação: ${authError.message}`);
        return;
      }

      // Após o usuário ser criado, obter o ID do usuário
      const userId = signUpData?.user?.id;

      if (!userId) {
        setError('Erro: usuário não foi criado.');
        return;
      }

      // Criação do perfil do usuário na tabela 'profiles'
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            email,
            full_name: fullName,
            role,
            id: userId, // Usando o ID do usuário criado
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (profileError) {
        setError(`Erro ao criar o perfil: ${profileError.message}`);
        return;
      }

      // Após cadastro bem-sucedido, redireciona para o dashboard
      navigate('/rh/dashboard');
      closeModal(); // Fecha o modal após sucesso
    } catch (err) {
      setError('Erro desconhecido ao criar o usuário!');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md w-96">
        <h2 className="text-xl font-semibold mb-4">Cadastrar Novo Usuário</h2>

        {!isUnlocked ? (
          <>
            <label htmlFor="unlockPassword" className="block text-lg">Insira a senha para desbloquear o cadastro:</label>
            <input
              type="password"
              id="unlockPassword"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
            <button
              type="button"
              onClick={handlePasswordCheck}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-4"
            >
              Desbloquear
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-lg">Nome Completo</label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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
              <div>
                <label htmlFor="role" className="block text-lg">Função</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'hr')}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                >
                  <option value="hr">RH</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-4"
              >
                Cadastrar
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default UserSignUpModal;
