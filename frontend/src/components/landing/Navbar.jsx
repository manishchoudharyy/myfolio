import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it works', href: '#how-it-works' },
    { name: 'FAQ', href: '#faq' },
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo */}
          <div className="shrink-0 flex items-center gap-1 cursor-pointer" onClick={() => navigate('/')}>
            <img className="h-10 w-auto rounded-full" src={logo} alt="MyFolio" />
            <span className="font-bold text-xl text-gray-900 tracking-tight">MyFolio</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium text-sm shadow-md hover:bg-blue-700 transition-colors"
              >
                Dashboard
              </motion.button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-900 font-medium hover:text-blue-600 transition-colors duration-200 text-sm"
                >
                  Log in
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                  className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium text-sm shadow-md hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-2 shadow-lg">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-100 mt-4 flex flex-col space-y-3">
                {isAuthenticated ? (
                  <button
                    onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium shadow-md active:scale-95 transition-transform"
                  >
                    Dashboard
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { navigate('/login'); setIsOpen(false); }}
                      className="block px-3 py-2 text-center text-base font-medium text-gray-700 hover:text-blue-600"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => { navigate('/login'); setIsOpen(false); }}
                      className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium shadow-md active:scale-95 transition-transform"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;