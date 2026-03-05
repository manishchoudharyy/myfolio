import React, { useState } from 'react';
import { BsTerminal, BsGithub, BsLinkedin, BsTwitter, BsCodeSlash } from "react-icons/bs";
import { FaArrowRight, FaCode, FaDatabase, FaCloud, FaLink, FaReact, FaNodeJs, FaPython, FaJava } from "react-icons/fa";
import { SiTypescript, SiPostgresql, SiMongodb, SiTailwindcss, SiNextdotjs, SiDjango, SiFlask, SiDocker, SiFigma } from "react-icons/si";
import { MdEmail, MdLocationOn } from "react-icons/md";

const FresherPortfolio = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setFormStatus({
                type: 'success',
                message: 'Thanks for reaching out! I\'ll get back to you soon.'
            });
            setFormData({ name: '', email: '', message: '' });
            setIsSubmitting(false);

            setTimeout(() => setFormStatus({ type: '', message: '' }), 5000);
        }, 1500);
    };

    // Skills data
    const skillCategories = [
        {
            title: 'Frontend',
            icon: <FaReact className="text-[#3c3cf6] text-2xl" />,
            skills: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML5/CSS3']
        },
        {
            title: 'Backend',
            icon: <FaNodeJs className="text-[#3c3cf6] text-2xl" />,
            skills: ['Node.js', 'Python', 'Express', 'Django', 'REST APIs']
        },
        {
            title: 'Database',
            icon: <SiPostgresql className="text-[#3c3cf6] text-2xl" />,
            skills: ['PostgreSQL', 'MongoDB', 'Firebase', 'MySQL', 'Prisma']
        },
        {
            title: 'Tools & Others',
            icon: <BsCodeSlash className="text-[#3c3cf6] text-2xl" />,
            skills: ['Git/GitHub', 'Docker', 'VS Code', 'Postman', 'Figma']
        }
    ];

    // Projects data
    const projects = [
        {
            title: 'EcoTrack - Carbon Footprint Calculator',
            description: 'A web app that calculates your carbon footprint based on daily activities. Provides personalized tips to reduce environmental impact.',
            tags: ['React', 'Node.js', 'MongoDB', 'Chart.js'],
            image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            github: '#',
            live: '#',
            category: 'Full Stack'
        },
        {
            title: 'DevConnect - Developer Community Platform',
            description: 'A platform for developers to share knowledge, ask questions, and collaborate on open-source projects.',
            tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind'],
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            github: '#',
            live: '#',
            category: 'Full Stack'
        },
        {
            title: 'WeatherWise - Real-time Weather App',
            description: 'Beautiful weather application with 7-day forecast, interactive maps, and weather alerts using OpenWeather API.',
            tags: ['React', 'API Integration', 'CSS Modules'],
            image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            github: '#',
            live: '#',
            category: 'Frontend'
        },
        {
            title: 'TaskFlow - Productivity Suite',
            description: 'Task management app with Kanban boards, priority sorting, and real-time collaboration features.',
            tags: ['Vue.js', 'Firebase', 'Tailwind CSS'],
            image: 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            github: '#',
            live: '#',
            category: 'Full Stack'
        }
    ];

    return (
        <div className="bg-[#0A0A0A] font-[Inter] text-slate-100 selection:bg-[#3c3cf6] selection:text-white overflow-x-hidden min-h-screen">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .glass-nav {
            background: rgba(26, 26, 26, 0.8);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.03);
        }
        
        .text-gradient {
            background: linear-gradient(135deg, #3c3cf6 0%, #8B5CF6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .skill-card {
            transition: all 0.3s ease;
            background: linear-gradient(145deg, #1A1A1A, #151515);
        }
        
        .skill-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px -10px rgba(60, 60, 246, 0.3);
            border-color: rgba(60, 60, 246, 0.3);
        }
        
        .project-card {
            transition: all 0.4s ease;
        }
        
        .project-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px -15px rgba(60, 60, 246, 0.3);
        }
        
        .tag-pill {
            background: rgba(60, 60, 246, 0.1);
            border: 1px solid rgba(60, 60, 246, 0.2);
            color: #3c3cf6;
            font-size: 0.7rem;
            font-weight: 600;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .form-input {
            background: #1A1A1A;
            border: 1px solid #2A2A2A;
            transition: all 0.2s ease;
        }
        
        .form-input:focus {
            border-color: #3c3cf6;
            box-shadow: 0 0 0 3px rgba(60, 60, 246, 0.1);
            outline: none;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        .float-animation {
            animation: float 5s ease-in-out infinite;
        }
      `}</style>

            {/* Simple Navbar */}
            <nav className="fixed top-0 w-full z-50 px-4 sm:px-6 py-3">
                <div className="max-w-6xl mx-auto glass-nav rounded-full px-6 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-[#3c3cf6] rounded-md flex items-center justify-center">
                            <BsTerminal className="text-white text-sm" />
                        </div>
                        <span className="font-semibold text-sm sm:text-base">Your Name</span>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        {['Skills', 'Projects', 'Contact'].map(item => (
                            <a key={item} className="text-xs font-medium text-slate-300 hover:text-[#3c3cf6] transition-colors" href={`#${item.toLowerCase()}`}>
                                {item}
                            </a>
                        ))}
                    </div>
                    <a
                        href="#"
                        className="bg-[#3c3cf6] text-white px-4 py-1.5 rounded-full text-xs font-medium hover:bg-[#3c3cf6]/90 transition-all hover:scale-105"
                    >
                        Resume
                    </a>
                </div>
            </nav>

            <main className="pt-28 pb-16 px-4 sm:px-6">
                {/* Hero Section - Fresher Focused */}
                <section className="max-w-6xl mx-auto mb-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3c3cf6]/10 border border-[#3c3cf6]/20">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3c3cf6] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3c3cf6]"></span>
                                </span>
                                <span className="text-[#3c3cf6] text-xs font-medium">Open to work</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                                Hi, I'm <span className="text-gradient">Your Name</span>
                            </h1>

                            <h2 className="text-xl sm:text-2xl text-slate-300">
                                Aspiring Full-Stack Developer
                            </h2>

                            <p className="text-slate-400 text-base leading-relaxed max-w-lg">
                                A passionate developer with hands-on experience in building web applications through academic projects and self-learning. Eager to contribute to real-world projects and grow as a developer.
                            </p>

                            {/* Quick Stats for Fresher */}
                            <div className="flex gap-6 pt-4">
                                <div>
                                    <div className="text-xl font-bold text-white">10+</div>
                                    <div className="text-xs text-slate-500">Projects Built</div>
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-white">5+</div>
                                    <div className="text-xs text-slate-500">Technologies</div>
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-white">2024</div>
                                    <div className="text-xs text-slate-500">Graduate</div>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-3 pt-4">
                                <button className="bg-[#3c3cf6] text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-[#3c3cf6]/20 transition-all text-sm">
                                    View Projects <FaArrowRight className="text-sm" />
                                </button>
                                <button className="border border-[#2A2A2A] text-slate-200 px-6 py-3 rounded-xl font-medium hover:bg-[#1A1A1A] transition-all text-sm">
                                    Contact Me
                                </button>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="relative flex justify-center lg:justify-end">
                            <div className="relative w-64 h-64 sm:w-72 sm:h-72 float-animation">
                                <div className="absolute inset-0 bg-[#3c3cf6]/20 rounded-full blur-[40px]"></div>
                                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                    <img
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Skills Section - Main Grid */}
                <section id="skills" className="max-w-6xl mx-auto mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                            Technical <span className="text-gradient">Skills</span>
                        </h2>
                        <p className="text-slate-400 text-sm max-w-xl mx-auto">
                            Technologies and tools I've learned and worked with during my journey
                        </p>
                    </div>

                    {/* Skills Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {skillCategories.map((category, idx) => (
                            <div key={idx} className="skill-card border border-[#2A2A2A] rounded-xl p-5">
                                <div className="w-10 h-10 bg-[#3c3cf6]/10 rounded-lg flex items-center justify-center mb-3">
                                    {category.icon}
                                </div>
                                <h3 className="text-base font-semibold mb-2">{category.title}</h3>
                                <div className="space-y-1.5">
                                    {category.skills.map((skill, i) => (
                                        <div key={i} className="flex items-center gap-2 text-slate-400 text-xs">
                                            <div className="w-1 h-1 bg-[#3c3cf6] rounded-full"></div>
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Additional Skills - Simple Chips */}
                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                        {['Git', 'VS Code', 'Postman', 'Vercel', 'Netlify', 'Figma', 'Jest', 'Webpack'].map((tool, idx) => (
                            <span key={idx} className="px-3 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full text-xs text-slate-300">
                                {tool}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Projects Section */}
                <section id="projects" className="max-w-6xl mx-auto mb-24">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                                My <span className="text-gradient">Projects</span>
                            </h2>
                            <p className="text-slate-400 text-sm">Real applications I've built to solve problems</p>
                        </div>
                        <a href="#" className="text-[#3c3cf6] text-sm font-medium flex items-center gap-1 group">
                            View on GitHub <FaArrowRight className="group-hover:translate-x-1 transition-transform text-xs" />
                        </a>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {projects.map((project, idx) => (
                            <div key={idx} className="project-card bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <span className="tag-pill">{project.category}</span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                                    <p className="text-slate-400 text-xs mb-3 leading-relaxed">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {project.tags.map((tag, i) => (
                                            <span key={i} className="px-2 py-1 bg-[#2A2A2A] rounded text-[10px] text-slate-300">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <a href={project.github} className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-1">
                                            <BsGithub /> Code
                                        </a>
                                        <a href={project.live} className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-1">
                                            <FaLink /> Live
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Section with Form */}
                <section id="contact" className="max-w-4xl mx-auto mb-16">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                            Get in <span className="text-gradient">Touch</span>
                        </h2>
                        <p className="text-slate-400 text-sm">
                            I'm currently looking for new opportunities. Let's connect!
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Contact Info - Simple */}
                        <div className="md:col-span-1 space-y-4">
                            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
                                <h3 className="text-sm font-semibold mb-3">Contact Info</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[#3c3cf6]/10 rounded-lg flex items-center justify-center">
                                            <MdEmail className="text-[#3c3cf6] text-sm" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500">Email</p>
                                            <a href="mailto:your.email@example.com" className="text-xs text-slate-300 hover:text-[#3c3cf6]">
                                                your.email@example.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[#3c3cf6]/10 rounded-lg flex items-center justify-center">
                                            <MdLocationOn className="text-[#3c3cf6] text-sm" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500">Location</p>
                                            <p className="text-xs text-slate-300">Your City, Country</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links - Simple */}
                            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
                                <h3 className="text-sm font-semibold mb-3">Social</h3>
                                <div className="flex gap-3">
                                    <a href="#" className="w-8 h-8 bg-[#2A2A2A] rounded-lg flex items-center justify-center hover:bg-[#3c3cf6] transition-colors">
                                        <BsGithub className="text-white text-sm" />
                                    </a>
                                    <a href="#" className="w-8 h-8 bg-[#2A2A2A] rounded-lg flex items-center justify-center hover:bg-[#3c3cf6] transition-colors">
                                        <BsLinkedin className="text-white text-sm" />
                                    </a>
                                    <a href="#" className="w-8 h-8 bg-[#2A2A2A] rounded-lg flex items-center justify-center hover:bg-[#3c3cf6] transition-colors">
                                        <BsTwitter className="text-white text-sm" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="md:col-span-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full form-input rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full form-input rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows="4"
                                        className="w-full form-input rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 resize-none"
                                        placeholder="Tell me about your opportunity..."
                                    />
                                </div>

                                {formStatus.message && (
                                    <div className={`p-3 rounded-lg text-xs ${formStatus.type === 'success'
                                            ? 'bg-green-500/10 border border-green-500/20 text-green-500'
                                            : 'bg-red-500/10 border border-red-500/20 text-red-500'
                                        }`}>
                                        {formStatus.message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#3c3cf6] text-white px-4 py-3 rounded-lg font-medium text-sm hover:bg-[#3c3cf6]/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            {/* Simple Footer */}
            <footer className="border-t border-[#2A2A2A] py-6 px-4">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="flex items-center gap-2">
                        <BsTerminal className="text-[#3c3cf6] text-xs" />
                        <span className="text-xs text-slate-400">Your Name</span>
                    </div>
                    <p className="text-xs text-slate-600">
                        © 2024 | Built with React & Tailwind
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="text-slate-500 hover:text-[#3c3cf6] text-xs transition-colors">GitHub</a>
                        <a href="#" className="text-slate-500 hover:text-[#3c3cf6] text-xs transition-colors">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default FresherPortfolio;