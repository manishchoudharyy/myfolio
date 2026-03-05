import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';
import logo from '../../assets/logo.png';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-[var(--color-bg)] border-t border-slate-200/60">

            {/* ── Main grid ──────────────────────────────── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

                    {/* Brand */}
                    <div className="shrink-0 lg:w-72">
                        <div className="flex items-center gap-2 mb-4">
                            <img src={logo} alt="MyFolio" className="w-8 h-8 rounded-[8px]" />
                            <span className="font-bold text-xl text-slate-900 tracking-tight">MyFolio</span>
                        </div>
                        <p className="text-base text-slate-500 leading-relaxed mb-6 font-medium">
                            The intelligent portfolio builder for modern professionals. Build code-free, host instantly.
                        </p>
                        {/* Social icons */}
                        <div className="flex items-center gap-3">
                            {[
                                { icon: Twitter, href: '#', label: 'Twitter' },
                                { icon: Github, href: '#', label: 'GitHub' },
                                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                            ].map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 flex items-center justify-center transition-all group"
                                >
                                    <Icon className="w-4 h-4 text-slate-500 group-hover:text-slate-900 transition-colors" strokeWidth={2} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">

                        {/* Product */}
                        <div>
                            <p className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Product</p>
                            <ul className="space-y-4">
                                {[
                                    { label: 'Features', href: '#features' },
                                    { label: 'How it works', href: '#how-it-works' },
                                    { label: 'Templates', href: '#' },
                                    { label: 'Pricing', href: '#' },
                                ].map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-base font-medium text-slate-500 hover:text-slate-900 transition-colors">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <p className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Resources</p>
                            <ul className="space-y-4">
                                {[
                                    { label: 'Blog', href: '#' },
                                    { label: 'Careers', href: '#' },
                                    { label: 'Help Center', href: '#' },
                                    { label: 'Contact', href: '#' },
                                ].map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-base font-medium text-slate-500 hover:text-slate-900 transition-colors">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <p className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Legal</p>
                            <ul className="space-y-4">
                                {[
                                    { label: 'Privacy Policy', href: '#' },
                                    { label: 'Terms of Service', href: '#' },
                                    { label: 'Cookie Policy', href: '#' },
                                ].map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-base font-medium text-slate-500 hover:text-slate-900 transition-colors">
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
            <div className="border-t border-slate-200/60 bg-slate-50/50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm font-medium text-slate-500">© {year} MyFolio Inc. All rights reserved.</p>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                        <span>Crafted with</span>
                        <span className="text-red-500">♥</span>
                        <span>for creators</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
