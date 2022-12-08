import './App.css';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createContext, useState } from 'react';
import { useCookies } from 'react-cookie';
import io from 'socket.io-client'

export const LoadingContext = createContext();
// export const HOST = 'https://tinder2-server.herokuapp.com'
export const HOST = 'http://localhost:8001';
export const socket = io.connect(HOST)
const App = () => {
  const [cookie] = useCookies();

  const { AuthToken } = cookie;
  return (
    <LoadingContext.Provider value={useState(false)}>
      <Router>
        <Routes>
          <Route path="/" element={<>{AuthToken ? <Dashboard /> : <Home />}</>} />
          <Route path="/dashboard" element={<>{AuthToken ? <Dashboard /> : <Home />}</>} />
          <Route path="/onboarding" element={<>{AuthToken ? <Onboarding /> : <Home />}</>} />
        </Routes>
      </Router>
    </LoadingContext.Provider>
  );
}

export default App;
