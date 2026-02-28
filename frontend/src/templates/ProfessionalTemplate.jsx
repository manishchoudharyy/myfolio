import React from "react";
import { Mail, Phone, Linkedin, Github, Twitter, Globe, ExternalLink } from "lucide-react";
import ContactBadge from "./shared/ContactBadge";

const ProfessionalTemplate = ({ data }) => (
    <div className="min-h-full bg-white p-6 sm:p-8 font-sans">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-xl p-6 text-white mb-8">
            <div className="flex items-center gap-4 mb-3">
                {data.avatar && (
                    <img src={data.avatar} alt={data.name} className="w-16 h-16 rounded-full object-cover border-2 border-white/40" />
                )}
                <div>
                    <h1 className="text-xl font-bold">{data.name || "Your Name"}</h1>
                    <p className="text-emerald-200 text-sm">{data.title || "Your Title"}</p>
                </div>
            </div>
            {data.about && <p className="text-emerald-100 text-sm leading-relaxed">{data.about}</p>}
        </div>

        {/* Skills */}
        {data.skills?.length > 0 && (
            <div className="mb-8">
                <h2 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-emerald-600 rounded" /> Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium border border-emerald-100">
                            {skill.name}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
            <div className="mb-8">
                <h2 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-emerald-600 rounded" /> Experience
                </h2>
                {data.experience.map((exp, i) => (
                    <div key={i} className="mb-4 pl-4 border-l-2 border-emerald-200">
                        <h3 className="font-semibold text-slate-900 text-sm">{exp.role}</h3>
                        <p className="text-xs text-emerald-600 font-medium">{exp.company}</p>
                        <p className="text-xs text-slate-400">{exp.startDate} – {exp.endDate || "Present"}</p>
                        {exp.description && <p className="text-xs text-slate-600 mt-1">{exp.description}</p>}
                    </div>
                ))}
            </div>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
            <div className="mb-8">
                <h2 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-emerald-600 rounded" /> Education
                </h2>
                {data.education.map((edu, i) => (
                    <div key={i} className="mb-3">
                        <h3 className="font-semibold text-slate-900 text-sm">{edu.degree} in {edu.field}</h3>
                        <p className="text-xs text-emerald-600">{edu.institution}</p>
                        <p className="text-xs text-slate-400">{edu.startYear} – {edu.endYear}</p>
                    </div>
                ))}
            </div>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
            <div className="mb-8">
                <h2 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-emerald-600 rounded" /> Projects
                </h2>
                {data.projects.map((project, i) => (
                    <div key={i} className="mb-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <h3 className="font-semibold text-slate-900 text-sm">{project.title}</h3>
                        {project.description && <p className="text-xs text-slate-600 mt-1">{project.description}</p>}
                        {project.techStack?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {project.techStack.map((tech, j) => (
                                    <span key={j} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] border border-emerald-100">{tech}</span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}

        {/* Contact */}
        {data.contact && (
            <div className="pt-6 border-t border-slate-100">
                <h2 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-emerald-600 rounded" /> Contact
                </h2>
                <div className="flex flex-wrap gap-3">
                    {data.contact.email && <ContactBadge icon={<Mail className="w-3 h-3" />} text={data.contact.email} />}
                    {data.contact.linkedin && <ContactBadge icon={<Linkedin className="w-3 h-3" />} text="LinkedIn" href={data.contact.linkedin} />}
                    {data.contact.github && <ContactBadge icon={<Github className="w-3 h-3" />} text="GitHub" href={data.contact.github} />}
                </div>
            </div>
        )}
    </div>
);

export default ProfessionalTemplate;
