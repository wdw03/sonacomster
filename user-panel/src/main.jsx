import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import UserApp from './UserApp.jsx'
import UserLoginPage from './UserLoginPage.jsx'
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
    return <UserLoginPage onLogin={handleLogin} />;
  }

  return <UserApp user={user} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
