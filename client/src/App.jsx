import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import About from './pages/About';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Projects from './pages/Projects';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import CreatePosts from './pages/CreatePosts'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'

function App() {
  return (
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
          <Route path='/createPosts' element={<CreatePosts />} />
        </Route>
        
        <Route element={<OnlyAdminPrivateRoute/>}>
          
        </Route>
        <Route path='/projects' element={<Projects />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
