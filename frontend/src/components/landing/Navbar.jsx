import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Products', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'Resources', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
  ];

  const handleGetStarted = () => navigate(isAuthenticated ? '/dashboard' : '/login');

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 sm:px-6 pointer-events-none"
    >
      <div className={`mx-auto max-w-5xl transition-all duration-500 rounded-full pointer-events-auto ${scrolled ? 'bg-white/70 backdrop-blur-xl shadow-lg ring-1 ring-slate-900/5' : 'bg-transparent'
        }`}>
        <div className="flex items-center justify-between px-4 sm:px-6 h-14">

          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group z-10"
            onClick={() => navigate('/')}
          >
            <img className="h-7 w-7 rounded-[8px] transition-transform group-hover:scale-105" src={logo} alt="MyFolio" />
            <span className="font-bold text-lg text-slate-900 tracking-tight">MyFolio</span>
          </div>

          {/* Desktop nav links — centered */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 bg-slate-900/5 p-1 rounded-full border border-slate-200/50 backdrop-blur-md z-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all hover:shadow-sm"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2 z-10">
            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold shadow-md hover:bg-slate-800 transition-all"
              >
                Dashboard <ChevronRight className="w-4 h-4 text-slate-400" />
              </motion.button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors"
                >
                  Log in
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGetStarted}
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold shadow-[0_4px_14px_0_rgb(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] transition-all"
                >
                  Start Building
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 inset-x-4 md:hidden bg-white/90 backdrop-blur-2xl border border-slate-200/50 rounded-3xl overflow-hidden shadow-2xl pointer-events-auto"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-2xl text-base font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-4 mt-2 border-t border-slate-100 space-y-3 px-2">
                {isAuthenticated ? (
                  <button
                    onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                    className="w-full bg-slate-900 text-white flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-sm"
                  >
                    Enter Dashboard <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { navigate('/login'); setIsOpen(false); }}
                      className="w-full py-3 text-center text-sm font-bold text-slate-700 bg-slate-100 rounded-full hover:bg-slate-200"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => { navigate('/login'); setIsOpen(false); }}
                      className="w-full bg-slate-950 text-white py-3 rounded-full font-bold text-sm shadow-[0_4px_14px_0_rgb(0,0,0,0.15)]"
                    >
                      Start Building Free
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