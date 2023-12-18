import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
// Remove Firebase imports

const Login = () => {
  const [email, setEmail] = useState('default@example.com'); // Set default email
  const [password, setPassword] = useState('defaultpassword'); // Set default password
  const navigate = useNavigate();

  const login = async () => {
    // Remove Firebase authentication logic for simplicity

    try {
      // Simulate login success
      toast.success('Login successful', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      // Simulate storing user information
      localStorage.setItem('user', JSON.stringify({ email }));
      navigate('/view');
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Please check your credentials.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      navigate('/');

    }
  };

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 bg-gray-800 opacity-70"></div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="bg-gray-800 bg-opacity-0 px-10 py-10 rounded-xl" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>

            <div>
              <h1 className="text-center text-white text-xl mb-4 font-bold">Login</h1>
            </div>
            <div>
              <input
                type="email"
                // value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
                placeholder="Email"
              />
            </div>
            <div>
              <input
                type="password"
                // value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
                placeholder="Password"
              />
            </div>
            <div className="flex justify-center mb-3">
              <button
                onClick={login}
                className="bg-blue-500 w-full text-white font-bold px-4 py-2 rounded-lg"
              >
                Login
              </button>
            </div>
            <div>
              <h2 className="text-white">
                Don't have an account?{' '}
                <Link className="text-blue-500 font-bold" to={'/signup'}>
                  Signup
                </Link>
              </h2>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
