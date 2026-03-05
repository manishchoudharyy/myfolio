import React from "react";
import { Mail, Phone, Linkedin, Github, Twitter, Globe, ExternalLink } from "lucide-react";
import ContactBadge from "./shared/ContactBadge";
import { sanitizeUrl } from "../utils/sanitize";

const MinimalTemplate = ({ data }) => (
    <div className="min-h-full bg-white p-6 sm:p-8 font-sans">
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4 mb-4">
                {data.avatar && (
                    <img src={data.avatar} alt={data.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-100" />
                )}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{data.name || "Your Name"}</h1>
                    <p className="text-slate-500 text-sm">{data.title || "Your Title"}</p>
                </div>
            </div>
            {data.about && <p className="text-slate-600 text-sm leading-relaxed max-w-xl">{data.about}</p>}
        </div>

        {/* Skills */}
        {data.skills?.length > 0 && (
            <div className="mb-8">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                            {skill.name}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
            <div className="mb-8">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Experience</h2>
                {data.experience.map((exp, i) => (
                    <div key={i} className="mb-4 pl-4 border-l-2 border-slate-200">
                        <h3 className="font-semibold text-slate-900 text-sm">{exp.role}</h3>
                        <p className="text-xs text-slate-500">{exp.company} · {exp.startDate} – {exp.endDate || "Present"}</p>
                        {exp.description && <p className="text-xs text-slate-600 mt-1">{exp.description}</p>}
                    </div>
                ))}
            </div>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
            <div className="mb-8">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Education</h2>
                {data.education.map((edu, i) => (
                    <div key={i} className="mb-3">
                        <h3 className="font-semibold text-slate-900 text-sm">{edu.degree} in {edu.field}</h3>
                        <p className="text-xs text-slate-500">{edu.institution} · {edu.startYear} – {edu.endYear}</p>
                    </div>
                ))}
            </div>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
            <div className="mb-8">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Projects</h2>
                {data.projects.map((project, i) => (
                    <div key={i} className="mb-4 p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900 text-sm">{project.title}</h3>
                            <div className="flex gap-2">
                                {project.liveUrl && (
                                    <a href={sanitizeUrl(project.liveUrl)} target="_blank" rel="noreferrer" className="text-blue-600">
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                                {project.githubUrl && (
                                    <a href={sanitizeUrl(project.githubUrl)} target="_blank" rel="noreferrer" className="text-slate-600">
                                        <Github className="w-3 h-3" />
                                    </a>
                                )}
                            </div>
                        </div>
                        {project.description && <p className="text-xs text-slate-600 mt-1">{project.description}</p>}
                        {project.techStack?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {project.techStack.map((tech, j) => (
                                    <span key={j} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded text-[10px]">{tech}</span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}

        {/* Certificates */}
        {data.certificates?.length > 0 && (
            <div className="mb-8">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Certificates</h2>
                {data.certificates.map((cert, i) => (
                    <div key={i} className="mb-2">
                        <h3 className="font-semibold text-slate-900 text-sm">{cert.title}</h3>
                        <p className="text-xs text-slate-500">{cert.issuer} · {cert.date}</p>
                    </div>
                ))}
            </div>
        )}

        {/* Contact */}
        {data.contact && (
            <div className="pt-6 border-t border-slate-100">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Contact</h2>
                <div className="flex flex-wrap gap-3">
                    {data.contact.email && <ContactBadge icon={<Mail className="w-3 h-3" />} text={data.contact.email} />}
                    {data.contact.phone && <ContactBadge icon={<Phone className="w-3 h-3" />} text={data.contact.phone} />}
                    {data.contact.linkedin && <ContactBadge icon={<Linkedin className="w-3 h-3" />} text="LinkedIn" href={data.contact.linkedin} />}
                    {data.contact.github && <ContactBadge icon={<Github className="w-3 h-3" />} text="GitHub" href={data.contact.github} />}
                </div>
            </div>
        )}
    </div>
);

export default MinimalTemplate;
