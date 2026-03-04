import React from 'react';
import { motion } from 'motion/react';
import { Globe, Sparkles, FileText, LayoutTemplate, Smartphone, Zap } from 'lucide-react';

const features = [
    {
        icon: Sparkles,
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-50',
        title: 'AI Content Assistant',
        desc: 'Stuck on your "About Me"? Let our AI write professional bios and project descriptions tailored to your background.',
    },
    {
        icon: FileText,
        iconColor: 'text-indigo-600',
        iconBg: 'bg-indigo-50',
        title: 'Resume to Portfolio',
        desc: 'Upload your PDF resume and watch as we extract your details to auto-fill your entire portfolio in seconds.',
    },
    {
        icon: Globe,
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-50',
        title: 'Custom Subdomain',
        desc: 'Get a professional URL (you.myfolio.fun) instantly. No DNS configuration, no hosting setup required.',
    },
    {
        icon: LayoutTemplate,
        iconColor: 'text-violet-600',
        iconBg: 'bg-violet-50',
        title: 'Beautiful Templates',
        desc: 'Switch between Minimal, Modern, or Professional designs with one click. Your data stays perfectly intact.',
    },
    {
        icon: Smartphone,
        iconColor: 'text-orange-600',
        iconBg: 'bg-orange-50',
        title: 'Fully Responsive',
        desc: 'Your portfolio looks perfect on phones, tablets, and desktops. Built mobile-first by design.',
    },
    {
        icon: Zap,
        iconColor: 'text-yellow-600',
        iconBg: 'bg-yellow-50',
        title: 'Instant Updates',
        desc: 'Fix a typo or add a new project from your dashboard and see it go live immediately. No reload needed.',
    },
];

function Features() {
    return (
        <section id="features" className="py-12 md:py-20 lg:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-2xl mx-auto mb-8 md:mb-12 lg:mb-14"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold mb-4">
                        Everything Included
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-4">
                        Everything you need to{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            get hired
                        </span>
                    </h2>
                    <p className="text-slate-500 text-base sm:text-lg leading-relaxed">
                        Stop worrying about HTML, CSS, or hosting. Focus on your story, and let our technology handle the rest.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {features.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.5 }}
                                className="group bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
                            >
                                <div className={`w-10 h-10 sm:w-11 sm:h-11 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform`}>
                                    <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default Features;
