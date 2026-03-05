import React from "react";

const Input = ({ label, value, onChange, placeholder, disabled, icon: Icon, type = "text" }) => (
    <div>
        <label className="block text-sm font-bold text-slate-700 mb-2 truncate">{label}</label>
        <div className="relative">
            {Icon && (
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icon className="w-5 h-5" />
                </div>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={`w-full bg-slate-50 border border-slate-200 outline-none rounded-xl px-4 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-slate-900 transition-all placeholder:text-slate-400 placeholder:font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed ${Icon ? "pl-11" : ""
                    }`}
            />
        </div>
    </div>
);

export default Input;
