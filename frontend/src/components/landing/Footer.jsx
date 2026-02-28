import React from 'react';
import logo from '../../assets/logo.png';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="MyFolio" className="w-8 h-8 rounded-full" />
                        <span className="font-bold text-lg">MyFolio</span>
                    </div>

                    <div className="flex items-center gap-8 text-sm text-slate-400">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
                        <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                    </div>

                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} MyFolio. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
