import React from "react";

const ContactBadge = ({ icon, text, href, dark = false }) => {
    const Wrapper = href ? "a" : "span";
    const props = href ? { href, target: "_blank", rel: "noreferrer" } : {};
    return (
        <Wrapper
            {...props}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${dark
                    ? "bg-white/10 text-white/80 hover:bg-white/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
        >
            {icon}
            {text}
        </Wrapper>
    );
};

export default ContactBadge;
