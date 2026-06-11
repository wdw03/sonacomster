import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import AdminApp from './AdminApp.jsx'
import AdminLoginPage from './AdminLoginPage.jsx'
import './style.css'
import './App.css'

function Root() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('qprs_isLoggedIn') === 'true');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('qprs_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('qprs_isLoggedIn', 'true');
    localStorage.setItem('qprs_user', JSON.stringify(userData));
  };

  if (!isLoggedIn) {
    return <AdminLoginPage onLogin={handleLogin} />;
  }

  return <AdminApp user={user} setIsLoggedIn={setIsLoggedIn} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)