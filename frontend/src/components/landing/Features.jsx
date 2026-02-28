import React from 'react'
import { motion } from 'motion/react'
import { Globe, Sparkles, FileText, LayoutTemplate, Smartphone, Zap } from 'lucide-react'

function Features() {
    const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  return (
    <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to get hired</h2>
            <p className="text-slate-600">Stop worrying about HTML, CSS, or hosting. Focus on your story, and let our tech handle the rest.</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <FeatureCard 
              icon={<Globe className="w-6 h-6 text-blue-600" />}
              title="Custom Subdomain"
              desc="Get a professional URL (you.ourdomain.com) instantly. No DNS configuration required."
            />
            <FeatureCard 
              icon={<Sparkles className="w-6 h-6 text-purple-600" />}
              title="AI Content Assistant"
              desc="Stuck on your 'About Me'? Let our AI write professional bios and project descriptions for you."
            />
            <FeatureCard 
              icon={<FileText className="w-6 h-6 text-green-600" />}
              title="Resume to Website"
              desc="Upload your PDF resume and watch as we extract your details to auto-fill your portfolio."
            />
             <FeatureCard 
              icon={<LayoutTemplate className="w-6 h-6 text-pink-600" />}
              title="Live Templates"
              desc="Switch between Minimal, Creative, or Corporate designs with a single click. Keep your data intact."
            />
            <FeatureCard 
              icon={<Smartphone className="w-6 h-6 text-orange-600" />}
              title="Fully Responsive"
              desc="Your portfolio looks perfect on phones, tablets, and desktops. Built mobile-first."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-yellow-600" />}
              title="Instant Updates"
              desc="Made a typo? Fix it in the dashboard and see it go live immediately. No re-deploying needed."
            />
          </motion.div>
        </div>
      </section>
  )
}

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-slate-100"
  >
    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </motion.div>
);
export default Features