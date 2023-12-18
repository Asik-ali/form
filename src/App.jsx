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

  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // Log the error to an error reporting service
      console.error(error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        return <div>Something went wrong.</div>;
      }
  
      return this.props.children;
    }
  }
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;


