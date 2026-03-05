import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CTA = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleAction = () => navigate(isAuthenticated ? '/dashboard' : '/login');

    return (
        <section className="py-20 md:py-32 bg-[var(--color-bg)]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-slate-950"
                >
                    {/* Dark Mode Abstract Textures */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

                    {/* Content */}
                    <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-24 lg:px-20 text-center flex flex-col items-center">

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            Free to get started
                        </div>

                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
                            Build your professional<br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400"> portfolio today.</span>
                        </h2>

                        <p className="text-slate-400 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                            Join hundreds of smart professionals who've already elevated their online presence. It takes less than 5 minutes to launch.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAction}
                                className="inline-flex items-center justify-center gap-2 bg-white text-slate-950 hover:bg-slate-50 px-8 py-4 rounded-full font-bold text-base shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all"
                            >
                                {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                            <a
                                href="#how-it-works"
                                className="inline-flex items-center justify-center gap-2 text-slate-300 hover:text-white border border-white/20 hover:bg-white/5 px-8 py-4 rounded-full font-bold text-base transition-all"
                            >
                                How it works
                            </a>
                        </div>

                        {/* Premium Divider */}
                        <div className="w-full max-w-lg mt-16 pt-8 border-t border-white/10 flex flex-wrap justify-between gap-6 sm:gap-8">
                            {[
                                { label: 'Portfolios created', value: '5,000+' },
                                { label: 'Stunning Templates', value: '5+' },
                                { label: 'Time to setup', value: '< 2 min' },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center flex-1">
                                    <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                                    <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
