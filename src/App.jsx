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

const App = () => {
  // Check if the user is logged in (use your authentication logic)
  const isLoggedIn = !!localStorage.getItem('user');

  // PrivateRoute component for protecting routes
  const PrivateRoute = ({ element }) => {
    return isLoggedIn ? (
      element
    ) : (
      <Navigate to="/login" state={{ from: window.location.pathname }} />
    );
  };

  return (
    <BrowserRouter>
      <div>
        <ToastContainer position="top-center" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/view"
            element={<PrivateRoute element={<View />} />}
          />
          <Route path="/fix/:id" element={<ViewDetails />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
