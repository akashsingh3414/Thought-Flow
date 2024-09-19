import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignIn from './pages/SignIn'
import About from './pages/About'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Projects from './pages/Projects'
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/project' element={<Projects />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App