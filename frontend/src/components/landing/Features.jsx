import React from 'react';
import { motion } from 'motion/react';
import { Globe, Sparkles, FileText, LayoutTemplate, Smartphone, Zap } from 'lucide-react';

const features = [
    {
        icon: Sparkles,
        iconColor: 'text-indigo-600',
        iconBg: 'bg-indigo-50 border-indigo-100',
        title: 'AI Content Assistant',
        desc: 'Stuck on your "About Me"? Let our advanced AI write highly professional bios and project descriptions tailored to your specific industry background.',
        span: 'col-span-1 md:col-span-2 lg:col-span-2',
        pattern: true,
    },
    {
        icon: FileText,
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-50 border-blue-100',
        title: 'Resume to Portfolio',
        desc: 'Upload your PDF resume and watch as we instantly extract and sort your details.',
        span: 'col-span-1 md:col-span-1 lg:col-span-1',
    },
    {
        icon: LayoutTemplate,
        iconColor: 'text-violet-600',
        iconBg: 'bg-violet-50 border-violet-100',
        title: 'Beautiful Templates',
        desc: 'Switch between Minimal, Modern, or Professional aesthetics with one single click. Your state is preserved perfectly.',
        span: 'col-span-1 md:col-span-1 lg:col-span-1',
    },
    {
        icon: Globe,
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-50 border-emerald-100',
        title: 'Custom Subdomain',
        desc: 'Claim your professional URL instantly (e.g., alex.myfolio.fun). Zero DNS configuration or hosting setup required.',
        span: 'col-span-1 md:col-span-2 lg:col-span-2',
    },
    {
        icon: Smartphone,
        iconColor: 'text-orange-600',
        iconBg: 'bg-orange-50 border-orange-100',
        title: 'Fully Responsive',
        desc: 'Your portfolio adapts perfectly to any screen size. Built mobile-first from the ground up.',
        span: 'col-span-1 md:col-span-2 lg:col-span-2',
    },
    {
        icon: Zap,
        iconColor: 'text-amber-500',
        iconBg: 'bg-amber-50 border-amber-100',
        title: 'Instant Updates',
        desc: 'Edit live from your dashboard. No rebuilds, no waiting.',
        span: 'col-span-1 md:col-span-1 lg:col-span-1',
    },
];

function Features() {
    return (
        <section id="features" className="py-24 md:py-36 bg-[var(--color-bg)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center max-w-2xl mx-auto mb-20 md:mb-24"
                >
                    <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-white ring-subtle text-slate-600 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                        Everything Included
                    </div>
                    <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-slate-900 leading-[1.05] mb-6 tracking-tight">
                        Built for results.{' '}
                        <span className="relative inline-block mt-2">
                            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Zero friction.</span>
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4, duration: 0.7, ease: "easeInOut" }}
                                className="absolute bottom-2 left-0 h-3.5 bg-indigo-200/50 -rotate-1 skew-x-12 rounded-sm -z-10"
                            />
                        </span>
                    </h2>
                    <p className="text-slate-500 text-lg sm:text-xl leading-relaxed font-medium">
                        Stop fighting with generic website builders. We provide exactly what you need to showcase your work and get hired.
                    </p>
                </motion.div>

                {/* Asymmetric Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {features.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                className={`group relative bg-white rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] ring-1 ring-slate-900/5 overflow-hidden flex flex-col ${feature.span}`}
                            >
                                {/* Abstract Pattern for large cards */}
                                {feature.pattern && (
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 to-transparent opacity-50 pointer-events-none" />
                                )}

                                {/* Large Watermark Number */}
                                <div className="absolute -top-6 -right-6 text-[8rem] font-black text-slate-900/[0.03] pointer-events-none select-none z-0 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700">
                                    0{i + 1}
                                </div>

                                <div className="relative z-10 flex-1">
                                    <div className={`w-14 h-14 ${feature.iconBg} border rounded-2xl flex items-center justify-center mb-10 shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500`}>
                                        <Icon className={`w-6 h-6 ${feature.iconColor}`} strokeWidth={1.5} />
                                    </div>

                                    <div className="mt-auto">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-indigo-600 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-slate-500 text-base leading-relaxed font-medium">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default Features;
