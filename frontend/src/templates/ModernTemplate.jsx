import React from "react";
import { Mail, Phone, Linkedin, Github, Twitter, Globe, ExternalLink } from "lucide-react";
import ContactBadge from "./shared/ContactBadge";

const ModernTemplate = ({ data }) => (
    <div className="min-h-full bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white p-6 sm:p-8 font-sans">
        {/* Header */}
        <div className="text-center mb-10">
            {data.avatar && (
                <img src={data.avatar} alt={data.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-3 border-indigo-400 shadow-lg shadow-indigo-500/30" />
            )}
            <h1 className="text-2xl font-bold mb-1">{data.name || "Your Name"}</h1>
            <p className="text-indigo-300 text-sm font-medium">{data.title || "Your Title"}</p>
            {data.about && <p className="text-slate-400 text-sm mt-3 max-w-md mx-auto leading-relaxed">{data.about}</p>}
        </div>

        {/* Skills */}
        {data.skills?.length > 0 && (
            <div className="mb-8">
                <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur text-white rounded-full text-xs font-medium border border-white/10">
                            {skill.name}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
            <div className="mb-8">
                <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">Experience</h2>
                {data.experience.map((exp, i) => (
                    <div key={i} className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                        <h3 className="font-semibold text-sm">{exp.role}</h3>
                        <p className="text-xs text-indigo-300">{exp.company} · {exp.startDate} – {exp.endDate || "Present"}</p>
                        {exp.description && <p className="text-xs text-slate-400 mt-1">{exp.description}</p>}
                    </div>
                ))}
            </div>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
            <div className="mb-8">
                <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">Education</h2>
                {data.education.map((edu, i) => (
                    <div key={i} className="mb-3 p-3 bg-white/5 rounded-lg border border-white/10">
                        <h3 className="font-semibold text-sm">{edu.degree} in {edu.field}</h3>
                        <p className="text-xs text-indigo-300">{edu.institution} · {edu.startYear} – {edu.endYear}</p>
                    </div>
                ))}
            </div>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
            <div className="mb-8">
                <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">Projects</h2>
                <div className="grid gap-3">
                    {data.projects.map((project, i) => (
                        <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-sm">{project.title}</h3>
                                <div className="flex gap-2">
                                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300"><ExternalLink className="w-3 h-3" /></a>}
                                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-300"><Github className="w-3 h-3" /></a>}
                                </div>
                            </div>
                            {project.description && <p className="text-xs text-slate-400 mt-1">{project.description}</p>}
                            {project.techStack?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {project.techStack.map((tech, j) => (
                                        <span key={j} className="px-2 py-0.5 bg-indigo-600/30 text-indigo-300 rounded text-[10px]">{tech}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Contact */}
        {data.contact && (
            <div className="pt-6 border-t border-white/10">
                <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">Contact</h2>
                <div className="flex flex-wrap gap-3">
                    {data.contact.email && <ContactBadge icon={<Mail className="w-3 h-3" />} text={data.contact.email} dark />}
                    {data.contact.linkedin && <ContactBadge icon={<Linkedin className="w-3 h-3" />} text="LinkedIn" href={data.contact.linkedin} dark />}
                    {data.contact.github && <ContactBadge icon={<Github className="w-3 h-3" />} text="GitHub" href={data.contact.github} dark />}
                </div>
            </div>
        )}
    </div>
);

export default ModernTemplate;
