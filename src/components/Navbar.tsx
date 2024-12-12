import { Menu, X, BarChart, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BarChart className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ResourceFlow</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-indigo-600 transition-colors">Pricing</a>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64' : 'max-h-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <a 
            href="#features" 
            className="block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            Features
          </a>
          <a 
            href="#pricing" 
            className="block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            Pricing
          </a>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => {
                  navigate('/dashboard');
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate('/login');
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  navigate('/register');
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}