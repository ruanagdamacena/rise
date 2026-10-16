import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Ativa o sistema de navegação entre páginas
import App from './App.jsx' // Componente raiz da aplicação
import { AuthProvider } from './contexts/AuthContext' // Guarda quem está logado
import './styles/global.css' // Importa os estilos globais que criamos

ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode ativa avisos extras durante o desenvolvimento
  <React.StrictMode>
    {/* BrowserRouter envolve tudo para que a navegação funcione em qualquer componente */}
    <BrowserRouter>
      {/* AuthProvider permite que qualquer tela saiba se há um usuário logado */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)