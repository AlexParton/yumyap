import React, { Fragment, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Header from './components/Layout/Header';
import HomePage from './pages/HomePage';
import Loader from './components/UI/Loader';

const CategoriesPage = React.lazy(() => import('./pages/CategoriesPage'));
const RecetaDetailPage = React.lazy(() => import('./pages/RecetaDetailPage'));
const CrearRecetaPage = React.lazy(() => import('./pages/CrearRecetaPage'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const RecetasPage = React.lazy(() => import('./pages/RecetasPage'));

function App() {
  const location = useLocation();
  const navigate = useNavigate()
  return (
    <Fragment>
      <Header path={location.pathname}/>
        <main>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categorias" element={<CategoriesPage />} />
              <Route path="/recetas/:categoriaId" element={<RecetasPage />} />
              <Route path="/:recetaId" element={<RecetaDetailPage />} />
              <Route path='/crear-receta' 
                element={localStorage.getItem('uid') ? <CrearRecetaPage /> : <Navigate to='/registro' replace={true}/>} 
              />
              <Route path='/registro' element={<RegisterPage onTap={()=>{navigate('/')}}/>} />
              <Route path='/user-area' 
                element={localStorage.getItem('uid') ? <UserProfile /> : <Navigate to='/registro' replace={true}/>} 
              /> 
              <Route path='/users/:userId' element={<UserProfile />} />
              <Route path='/crear-receta/:recetaId' element={<CrearRecetaPage />}/>
            </Routes>
          </Suspense>
        </main>
    </Fragment>
     
  );
}

export default App;
