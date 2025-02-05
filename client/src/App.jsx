import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import About from './pages/About';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import PostPage from './pages/PostPage';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Posts from './pages/Posts';

function App() {

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header/>
        <main className="flex-grow mt-16">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/signin' element={<SignIn />} />
            <Route path='/signup' element={<SignUp />} />
            
            <Route element={<PrivateRoute />}>
              <Route path='/dashboard' element={<Dashboard />} />
            </Route>
            
            <Route path='/post/:postSlug' element={<PostPage />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/privacyPolicy' element={<PrivacyPolicy />} />
            <Route path='/termsAndconditions' element={<TermsAndConditions />} />
            <Route path='/posts' element={<Posts />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
