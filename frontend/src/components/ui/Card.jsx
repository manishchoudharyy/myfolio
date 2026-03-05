import React from "react";

const Card = ({ title, description, icon: Icon, children }) => (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-6">
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm">
                    {Icon && <Icon className="w-5 h-5" />}
                </div>
                <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
                    {description && <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">{description}</p>}
                </div>
            </div>
        </div>
        <div className="p-5 sm:p-6">
            {children}
        </div>
    </div>
);

export default Card;
