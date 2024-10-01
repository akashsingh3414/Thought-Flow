import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import About from './pages/About';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Projects from './pages/Projects';
import Header from './components/Header';
import Footer from './components/Footer';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import { useSelector } from 'react-redux';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const theme = useSelector((state) => state.theme.theme);
  return (
    <div className={theme === 'dark' ? 'dark bg-gray-900 text-white' : 'light bg-gray-100 text-black'}>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route element={<PrivateRoute/>}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route path='/projects' element={<Projects />} />
        <Route path='/settings' element={<Settings />} />
      </Routes>
      <Footer />
    </BrowserRouter>
    </div>
  );
}

export default App;
