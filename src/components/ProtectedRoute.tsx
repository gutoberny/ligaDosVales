import React from "react"; // <--- ESTA É A LINHA QUE FALTAVA
import { useSelector } from "react-redux"; // CORREÇÃO: o import correto é 'react-redux'
import { Navigate } from "react-router-dom";
import { RootState } from "../store/store";

// Definimos as props que o componente irá receber.
// 'children' refere-se ao componente que este ProtectedRoute irá "envolver".
interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Usamos o 'useSelector' para ler o estado de autenticação da nossa store Redux.
  const { user } = useSelector((state: RootState) => state.auth);

  // A lógica principal:
  // 1. Se NÃO existir um 'user' no estado, significa que não está logado.
  //    Nesse caso, usamos o componente 'Navigate' do React Router para redirecionar
  //    para a página de login.
  if (!user) {
    // O 'replace' é importante para que o utilizador não consiga usar o botão "Voltar"
    // do navegador para aceder novamente à página protegida.
    return <Navigate to="/login" replace />;
  }

  // 2. Se existir um 'user', significa que está logado.
  //    Nesse caso, simplesmente renderizamos o componente 'children'
  //    (a página que queremos proteger).
  return children;
};

export default ProtectedRoute;
