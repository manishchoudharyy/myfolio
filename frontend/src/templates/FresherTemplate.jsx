import React from "react";
import { Mail, Phone, Linkedin, Github, Twitter, Globe, ExternalLink } from "lucide-react";
import SkillIcon from "./shared/SkillIcon";
import { sanitizeUrl } from "../utils/sanitize";

const FresherTemplate = ({ data }) => {
    console.log("It's Rendering");
    const firstName = data.name?.split(" ")[0] || "dev";

    return (
        <div className="min-h-full bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-200 font-sans antialiased">
            {/* Header / Navigation */}
            <header className="sticky top-0 w-full bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 z-50">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                        &lt;{firstName.toLowerCase()} /&gt;
                    </span>
                    <ul className="hidden md:flex space-x-8 text-sm font-medium">
                        {["Home", "Skills", "Projects", "Contact"].map((item) => (
                            <li key={item}>
                                <a
                                    href={`#${item.toLowerCase()}`}
                                    className="hover:text-blue-400 transition-colors duration-300"
                                >
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>

            {/* Main Content */}
            <main>
                {/* Hero Section */}
                <section
                    id="home"
                    className="min-h-[80vh] flex items-center justify-center px-6 py-16"
                >
                    <div className="container mx-auto text-center md:text-left md:flex md:items-center md:justify-between">
                        <div className="md:w-1/2 space-y-6">
                            <p className="text-blue-400 font-medium tracking-wide">
                                👋 Hi, I'm {data.name || "Your Name"}
                            </p>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                                    {data.title || "Software Engineer"}
                                </span>
                            </h1>
                            {data.about && (
                                <p className="text-lg text-gray-400 max-w-lg mx-auto md:mx-0">
                                    {data.about}
                                </p>
                            )}
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <a
                                    href="#contact"
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
                                >
                                    Hire Me
                                </a>
                                <a
                                    href="#projects"
                                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors border border-gray-700"
                                >
                                    View Work
                                </a>
                            </div>
                        </div>
                        <div className="hidden md:block md:w-1/2">
                            <div className="relative w-72 h-72 mx-auto">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                                {data.avatar ? (
                                    <img
                                        src={data.avatar}
                                        alt={data.name}
                                        className="relative w-64 h-64 mx-auto rounded-full border-4 border-gray-700 object-cover"
                                    />
                                ) : (
                                    <div className="relative bg-gray-800 rounded-full w-64 h-64 mx-auto border-4 border-gray-700 flex items-center justify-center text-7xl">
                                        👩‍💻
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Skills Section */}
                {data.skills?.length > 0 && (
                    <section id="skills" className="py-20 px-6 bg-gray-900/50">
                        <div className="container mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                                <span className="text-white">Technical </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                                    Skills
                                </span>
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                                {data.skills.map((skill, i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-800/50 p-5 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all group flex flex-col items-center gap-3 text-center"
                                    >
                                        <SkillIcon name={skill.name} size={36} />
                                        <h3 className="font-semibold text-sm">{skill.name}</h3>
                                        <span className="text-xs text-gray-500 bg-gray-700/60 px-2 py-0.5 rounded-full">{skill.level || "Intermediate"}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Experience Section */}
                {data.experience?.length > 0 && (
                    <section className="py-20 px-6">
                        <div className="container mx-auto max-w-4xl">
                            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                                <span className="text-white">Work </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                                    Experience
                                </span>
                            </h2>
                            <div className="space-y-6">
                                {data.experience.map((exp, i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-800/30 rounded-2xl border border-gray-700 p-6 hover:border-blue-500/50 transition-all"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                            <h3 className="text-xl font-semibold text-white">{exp.role}</h3>
                                            <span className="text-sm text-gray-500">{exp.startDate} – {exp.endDate || "Present"}</span>
                                        </div>
                                        <p className="text-blue-400 text-sm font-medium mb-2">{exp.company}</p>
                                        {exp.description && <p className="text-gray-400 text-sm">{exp.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Education Section */}
                {data.education?.length > 0 && (
                    <section className="py-20 px-6 bg-gray-900/50">
                        <div className="container mx-auto max-w-4xl">
                            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                                <span className="text-white">My </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                                    Education
                                </span>
                            </h2>
                            <div className="space-y-6">
                                {data.education.map((edu, i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-800/30 rounded-2xl border border-gray-700 p-6 hover:border-blue-500/50 transition-all"
                                    >
                                        <h3 className="text-xl font-semibold text-white">{edu.degree} in {edu.field}</h3>
                                        <p className="text-blue-400 text-sm font-medium">{edu.institution}</p>
                                        <p className="text-sm text-gray-500">{edu.startYear} – {edu.endYear}</p>
                                        {edu.description && <p className="text-gray-400 text-sm mt-2">{edu.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Projects Section */}
                {data.projects?.length > 0 && (
                    <section id="projects" className="py-20 px-6">
                        <div className="container mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                                <span className="text-white">Featured </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                                    Projects
                                </span>
                            </h2>
                            <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
                                Showcasing my best work and personal projects.
                            </p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {data.projects.map((project, i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-800/30 rounded-2xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all group"
                                    >
                                        {/* Project image */}
                                        {project.image ? (
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-44 bg-gradient-to-br from-blue-900/40 to-teal-900/40 flex items-center justify-center text-4xl border-b border-gray-700">
                                                🚀
                                            </div>
                                        )}
                                        <div className="p-5">
                                            <h3 className="text-lg font-semibold mb-1 text-white">{project.title}</h3>
                                            {project.description && (
                                                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                                            )}
                                            {project.techStack?.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {project.techStack.map((t, j) => (
                                                        <span key={j} className="text-xs bg-gray-700 text-gray-300 px-2.5 py-0.5 rounded-full">{t}</span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex gap-4 items-center">
                                                {project.liveUrl && (
                                                    <a href={sanitizeUrl(project.liveUrl)} target="_blank" rel="noreferrer"
                                                        className="text-blue-400 text-sm font-medium hover:text-blue-300 flex items-center gap-1">
                                                        <ExternalLink className="w-3.5 h-3.5" /> Live
                                                    </a>
                                                )}
                                                {project.githubUrl && (
                                                    <a href={sanitizeUrl(project.githubUrl)} target="_blank" rel="noreferrer"
                                                        className="text-gray-400 text-sm font-medium hover:text-gray-300 flex items-center gap-1">
                                                        <Github className="w-3.5 h-3.5" /> Source
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Certificates Section */}
                {data.certificates?.length > 0 && (
                    <section className="py-20 px-6 bg-gray-900/50">
                        <div className="container mx-auto max-w-4xl">
                            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                                <span className="text-white">Certifi</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                                    cations
                                </span>
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {data.certificates.map((cert, i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-800/30 rounded-2xl border border-gray-700 p-6 hover:border-blue-500/50 transition-all"
                                    >
                                        <h3 className="font-semibold text-white text-lg">{cert.title}</h3>
                                        <p className="text-blue-400 text-sm font-medium">{cert.issuer}</p>
                                        <p className="text-sm text-gray-500">{cert.date}</p>
                                        {cert.url && (
                                            <a
                                                href={sanitizeUrl(cert.url)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm text-teal-400 hover:text-teal-300 mt-2 inline-flex items-center gap-1"
                                            >
                                                <ExternalLink className="w-3 h-3" /> View Certificate
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Contact Section */}
                {data.contact && (
                    <section id="contact" className="py-20 px-6 bg-gray-900/30">
                        <div className="container mx-auto max-w-4xl">
                            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                                <span className="text-white">Get In </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                                    Touch
                                </span>
                            </h2>
                            <p className="text-center text-gray-400 mb-12">
                                I'd love to hear from you. Let's connect!
                            </p>
                            <div className="flex flex-wrap justify-center gap-6">
                                {data.contact.email && (
                                    <a href={`mailto:${data.contact.email}`} className="flex items-center space-x-3 bg-gray-800/50 rounded-xl px-6 py-4 border border-gray-700 hover:border-blue-500/50 transition-all">
                                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-blue-400">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="font-medium text-sm">{data.contact.email}</p>
                                        </div>
                                    </a>
                                )}
                                {data.contact.phone && (
                                    <a href={`tel:${data.contact.phone}`} className="flex items-center space-x-3 bg-gray-800/50 rounded-xl px-6 py-4 border border-gray-700 hover:border-blue-500/50 transition-all">
                                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-blue-400">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Phone</p>
                                            <p className="font-medium text-sm">{data.contact.phone}</p>
                                        </div>
                                    </a>
                                )}
                            </div>
                            <div className="flex justify-center gap-4 mt-8">
                                {data.contact.github && (
                                    <a href={sanitizeUrl(data.contact.github)} target="_blank" rel="noreferrer"
                                        className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors border border-gray-700">
                                        <Github className="w-5 h-5" />
                                    </a>
                                )}
                                {data.contact.linkedin && (
                                    <a href={sanitizeUrl(data.contact.linkedin)} target="_blank" rel="noreferrer"
                                        className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors border border-gray-700">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                )}
                                {data.contact.twitter && (
                                    <a href={sanitizeUrl(data.contact.twitter)} target="_blank" rel="noreferrer"
                                        className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors border border-gray-700">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                )}
                                {data.contact.website && (
                                    <a href={sanitizeUrl(data.contact.website)} target="_blank" rel="noreferrer"
                                        className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors border border-gray-700">
                                        <Globe className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-8 px-6 text-center text-gray-500 text-sm">
                <p>© {new Date().getFullYear()} {data.name || "Portfolio"}. Built with MyFolio.</p>
            </footer>
        </div>
    );
};

export default FresherTemplate;
