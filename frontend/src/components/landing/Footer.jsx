import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';
import logo from '../../assets/logo.png';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-slate-100">

            {/* ── Main grid ──────────────────────────────── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-12">
                <div className="flex flex-col md:flex-row gap-10 md:gap-16">

                    {/* Brand */}
                    <div className="shrink-0 md:w-64">
                        <div className="flex items-center gap-2 mb-3">
                            <img src={logo} alt="MyFolio" className="w-8 h-8 rounded-lg" />
                            <span className="font-bold text-lg text-slate-900">MyFolio</span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed mb-5">
                            AI-powered portfolio builder for students and professionals. Build and launch in minutes — no code needed.
                        </p>
                        {/* Social icons */}
                        <div className="flex items-center gap-2">
                            {[
                                { icon: Twitter, href: '#', label: 'Twitter' },
                                { icon: Github, href: '#', label: 'GitHub' },
                                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                            ].map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-blue-50 flex items-center justify-center transition-colors group"
                                >
                                    <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8">

                        {/* Product */}
                        <div>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-4">Product</p>
                            <ul className="space-y-2.5">
                                {[
                                    { label: 'Features', href: '#features' },
                                    { label: 'How it works', href: '#how-it-works' },
                                    { label: 'Templates', href: '#' },
                                ].map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-4">Company</p>
                            <ul className="space-y-2.5">
                                {[
                                    { label: 'About', href: '#' },
                                    { label: 'Blog', href: '#' },
                                    { label: 'Contact', href: '#' },
                                ].map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-4">Legal</p>
                            <ul className="space-y-2.5">
                                {[
                                    { label: 'Privacy Policy', href: '#' },
                                    { label: 'Terms of Use', href: '#' },
                                ].map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bottom bar ─────────────────────────────── */}
            <div className="border-t border-slate-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-slate-400">© {year} MyFolio. All rights reserved.</p>
                    <p className="text-xs text-slate-400">Made with ❤️ for students & professionals</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
