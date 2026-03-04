import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Upload, Sparkles, Layers, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const steps = [
    {
        number: '01',
        icon: Upload,
        title: 'Upload Resume or Chat',
        description: 'Already have a resume? Upload it. No resume? Just chat with our AI and describe your experience — it handles everything.',
        iconBg: 'bg-blue-100',
    },
    {
        number: '02',
        icon: Sparkles,
        title: 'AI Builds Your Portfolio',
        description: 'Our AI extracts your skills, projects, and experience to generate compelling portfolio content in seconds.',
        iconBg: 'bg-indigo-100',
    },
    {
        number: '03',
        icon: Layers,
        title: 'Pick a Template',
        description: 'Browse beautiful templates and choose the one that matches your style. Switch anytime — your data stays intact.',
        iconBg: 'bg-violet-100',
    },
    {
        number: '04',
        icon: Rocket,
        title: 'Go Live Instantly',
        description: 'Choose your custom subdomain and publish with one click. Your portfolio is instantly live on your own professional link.',
        iconBg: 'bg-emerald-100',
    },
];

const HowItWorks = () => {
    const navigate = useNavigate();

    return (
        <section id="how-it-works" className="py-12 md:py-20 lg:py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-2xl mx-auto mb-10 md:mb-14 lg:mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold mb-4">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Simple Process
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-4">
                        From zero to live —{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            in 4 steps
                        </span>
                    </h2>
                    <p className="text-slate-500 text-base sm:text-lg leading-relaxed">
                        Stop worrying about HTML, CSS, or hosting. Focus on your story, and let MyFolio handle the presentation.
                    </p>
                </motion.div>

                {/* Steps grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 md:mb-12">
                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="relative bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
                            >
                                {/* Step number */}
                                <span className="absolute top-4 right-4 text-[11px] font-bold text-slate-300">
                                    {step.number}
                                </span>

                                {/* Icon */}
                                <div className={`w-10 h-10 sm:w-11 sm:h-11 ${step.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-5 h-5 text-blue-600" />
                                </div>

                                <h3 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">{step.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>

                                {/* Connector arrow (desktop only) */}
                                {i < steps.length - 1 && (
                                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                                        <ArrowRight className="w-5 h-5 text-slate-300" />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-8 md:mt-12"
                >
                    <button
                        onClick={() => navigate('/login')}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-100 group"
                    >
                        Start Building Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;
