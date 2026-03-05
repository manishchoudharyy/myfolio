import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Upload, Sparkles, Layers, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const steps = [
    {
        number: '01',
        icon: Upload,
        title: 'Upload Resume or Chat',
        description: 'Already have a resume? Upload it. No resume? Just chat with our AI and describe your experience.',
        iconStyle: 'text-indigo-600',
        bgStyle: 'bg-indigo-50 border-indigo-100',
    },
    {
        number: '02',
        icon: Sparkles,
        title: 'AI Structures Data',
        description: 'Our AI extracts your skills, projects, and experience to generate professional content instantly.',
        iconStyle: 'text-blue-600',
        bgStyle: 'bg-blue-50 border-blue-100',
    },
    {
        number: '03',
        icon: Layers,
        title: 'Pick a Template',
        description: 'Browse beautiful templates and choose the one that matches your style. Switch anytime, data stays intact.',
        iconStyle: 'text-violet-600',
        bgStyle: 'bg-violet-50 border-violet-100',
    },
    {
        number: '04',
        icon: Rocket,
        title: 'Go Live Instantly',
        description: 'Choose your custom subdomain and publish with one click. Your portfolio is instantly live.',
        iconStyle: 'text-emerald-600',
        bgStyle: 'bg-emerald-50 border-emerald-100',
    },
];

const HowItWorks = () => {
    const navigate = useNavigate();

    return (
        <section id="how-it-works" className="py-20 md:py-32 bg-white relative">

            {/* Subtle background element */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-slate-50 via-white to-white pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center max-w-2xl mx-auto mb-16 md:mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 ring-subtle text-slate-600 text-xs font-bold uppercase tracking-wider mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Simple Process
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-[1.1] mb-6">
                        From zero to live —{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600">
                            in 4 steps
                        </span>
                    </h2>
                    <p className="text-slate-500 text-lg leading-relaxed font-medium">
                        Stop worrying about HTML, CSS, or hosting. Focus on your story, and let MyFolio handle the presentation.
                    </p>
                </motion.div>

                {/* Steps grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16 relative">

                    {/* Connecting line for desktop */}
                    <div className="hidden lg:block absolute top-[2.5rem] sm:top-[3rem] left-[12%] right-[12%] h-[2px] bg-slate-100 z-0" />

                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.15, duration: 0.6, type: "spring", bounce: 0.3 }}
                                className="relative z-10 flex flex-col items-center text-center group"
                            >
                                {/* Icon Bubble */}
                                <div className={`w-20 h-20 sm:w-24 sm:h-24 ${step.bgStyle} border rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 relative`}>
                                    <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${step.iconStyle}`} strokeWidth={1.5} />

                                    {/* Step number badge */}
                                    <div className="absolute -top-1 -right-1 w-7 h-7 bg-slate-900 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md ring-2 ring-white">
                                        {step.number}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                <p className="text-base text-slate-500 leading-relaxed font-medium px-2">{step.description}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                >
                    <button
                        onClick={() => navigate('/login')}
                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-bold text-sm transition-all shadow-[0_8px_20px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_28px_rgb(0,0,0,0.16)] group"
                    >
                        Start Building Now
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-white transition-all" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;
