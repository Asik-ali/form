import React from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Login';
import Home from './Home';
import View from './View';
import ViewDetails from './ViewDetails';


function App() {
  return (
    <BrowserRouter>
      <div>
        <ToastContainer position='top-center' />
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/view' element={<View />}/>
                    {/* <Route path='/add' element={<ProtectedRoute><Addedit /></ProtectedRoute>} /> */}

          <Route path='/fix/:id' element={<ViewDetails />}/>
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;


