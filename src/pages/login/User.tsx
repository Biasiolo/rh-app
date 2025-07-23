import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { supabase } from '@/integration/supabase/client';

const UserLogin = () => {
  const { signIn } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [isMasterUser, setIsMasterUser] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signIn(email, password);
    if (error) {
      setError('Erro ao fazer login!');
    } else {
      if (isMasterUser) {
        setShowModal(true); // Abre o modal para cadastro
      } else {
        navigate('/rh/dashboard'); // Redireciona após login
      }
    }
  };

  const handlePasswordCheck = () => {
    if (inputPassword === 'Senha10!') {
      setIsMasterUser(true);
      setError('');
    } else {
      setError('Senha inválida!');
    }
  };

  const handleSignUp = async (role: 'hr' | 'candidate') => {
    try {
      // Cadastro do usuário no Supabase Auth
      const { data: userData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError('Erro ao cadastrar o usuário: ' + authError.message);
        return;
      }

      // Verificar se o usuário foi criado com sucesso e tem ID/email
      if (!userData.user?.id || !userData.user?.email) {
        setError('Erro: Dados do usuário inválidos');
        return;
      }

      // Inserir perfil na tabela profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userData.user.id,
            email: userData.user.email,
            full_name: 'Nome do usuário', // Pode ser atualizado posteriormente
            role: role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (profileError) {
        setError('Erro ao criar o perfil: ' + profileError.message);
        return;
      }

      alert('Usuário cadastrado com sucesso!');
      setShowModal(false);
      navigate('/rh/dashboard');
    } catch (err) {
      setError('Erro inesperado ao cadastrar usuário');
      console.error(err);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Login de Usuário (RH/Admin)</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
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
        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Entrar
        </button>
      </form>

      {/* Botão de cadastro */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-4"
      >
        Cadastrar Novo Usuário
      </button>

      {/* Modal de Cadastro */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md w-96">
            <h3 className="text-xl font-semibold mb-4">Cadastro de Novo Usuário</h3>
            
            {!isMasterUser ? (
              <>
                <label htmlFor="passwordCheck" className="block text-lg mb-2">
                  Digite a senha para desbloquear o cadastro
                </label>
                <input
                  type="password"
                  id="passwordCheck"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="Senha padrão"
                  className="w-full px-4 py-2 border rounded-md mb-4"
                />
                <button 
                  onClick={handlePasswordCheck}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Verificar
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Escolha o tipo de usuário para cadastrar:
                </p>
                <button 
                  onClick={() => handleSignUp('hr')}
                  className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 mb-2"
                >
                  Cadastrar como RH
                </button>
                <button 
                  onClick={() => handleSignUp('candidate')}
                  className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Cadastrar como Candidato
                </button>
              </div>
            )}
            
            <button 
              onClick={() => {
                setShowModal(false);
                setIsMasterUser(false);
                setInputPassword('');
              }}
              className="w-full py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 mt-4"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLogin;
