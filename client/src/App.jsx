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
import CreatePost from './components/Dashboard/CreatePost';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import AdminUpdateUser from './components/Dashboard/AdminUpdateUser';
import PostPage from './pages/PostPage';
import UpdatePost from './components/Dashboard/UpdatePost';
import UpdateProfile from './components/Dashboard/UpdateProfile';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            
            <Route path='/' element={<Home />} />
            <Route path='/home' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/signin' element={<SignIn />} />
            <Route path='/signup' element={<SignUp />} />
            
            <Route element={<PrivateRoute />}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/updateProfile' element={<UpdateProfile />} />
              <Route path='/updatePost' element={<UpdatePost />} />

            </Route>
            
            <Route element={<OnlyAdminPrivateRoute />}>
              <Route path='/createPost' element={<CreatePost />} />
              <Route path='/updateUser' element={<AdminUpdateUser />} />
            </Route>

            <Route path='/post/:postSlug' element={<PostPage />} />
            <Route path='/updatePost' element={<UpdatePost />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
