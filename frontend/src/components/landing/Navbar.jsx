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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'How it works', href: '#how-it-works' },
  ];

  const handleGetStarted = () => navigate(isAuthenticated ? '/dashboard' : '/login');

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <img className="h-8 w-8 rounded-lg" src={logo} alt="MyFolio" />
            <span className="font-bold text-lg text-slate-900 tracking-tight">MyFolio</span>
          </div>

          {/* Desktop nav links — centered */}
          <div className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Dashboard
              </motion.button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-slate-600 font-medium hover:text-blue-600 transition-colors text-sm px-3 py-2"
                >
                  Log in
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGetStarted}
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Get Started
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden shadow-lg"
          >
            <div className="px-4 py-5 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-3 border-t border-slate-100 mt-3 space-y-2">
                {isAuthenticated ? (
                  <button
                    onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm active:scale-95 transition-transform"
                  >
                    Dashboard
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { navigate('/login'); setIsOpen(false); }}
                      className="w-full py-2.5 text-center text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => { navigate('/login'); setIsOpen(false); }}
                      className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm active:scale-95 transition-transform"
                    >
                      Get Started Free
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