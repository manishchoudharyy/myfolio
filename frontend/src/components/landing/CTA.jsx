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
        <section className="py-12 md:py-20 lg:py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 rounded-3xl overflow-hidden"
                >
                    {/* Background orbs */}
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-52 h-52 bg-indigo-800/30 rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none" />

                    {/* Content */}
                    <div className="relative z-10 px-6 py-10 sm:px-12 sm:py-14 lg:px-16 lg:py-20 text-center">

                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-5 sm:mb-6">
                            <Sparkles className="w-3.5 h-3.5" />
                            Free to get started
                        </div>

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-4 sm:mb-5">
                            Ready to build your<br />professional portfolio?
                        </h2>

                        <p className="text-blue-200 text-base sm:text-lg mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed">
                            Join hundreds of students and professionals who've already created their portfolio with MyFolio. It takes less than 5 minutes.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleAction}
                                className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl transition-all"
                            >
                                {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                            <a
                                href="#how-it-works"
                                className="inline-flex items-center justify-center gap-2 text-white/80 hover:text-white border border-white/20 hover:border-white/40 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
                            >
                                Learn more
                            </a>
                        </div>

                        {/* Stats row */}
                        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10">
                            {[
                                { label: 'Portfolios created', value: '500+' },
                                { label: 'Templates available', value: '4+' },
                                { label: 'Time to publish', value: '< 5 min' },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
                                    <p className="text-blue-200 text-xs sm:text-sm mt-0.5">{stat.label}</p>
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
