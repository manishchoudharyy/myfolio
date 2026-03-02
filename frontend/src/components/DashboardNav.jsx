import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
    LayoutDashboard, Sparkles, FileText, UserCircle2,
    LogOut, ExternalLink, Menu, X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const links = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/onboarding", icon: Sparkles, label: "Edit Portfolio" },
    { to: "/resume", icon: FileText, label: "Resume" },
    { to: "/profile", icon: UserCircle2, label: "Profile" },
];

const DashboardNav = ({ portfolioUrl }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const NavItem = ({ to, icon: Icon, label, onClick }) => (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
            }
        >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
        </NavLink>
    );

    return (
        <>
            {/* ── Top Bar ── */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

                    {/* Logo */}
                    <div className="flex items-center gap-2.5 shrink-0">
                        <img src={logo} alt="MyFolio" className="w-8 h-8 rounded-full shadow-sm" />
                        <span className="font-bold text-slate-900 text-sm">MyFolio</span>
                    </div>

                    {/* Desktop nav links */}
                    <nav className="hidden md:flex items-center gap-0.5">
                        {links.map(({ to, icon: Icon, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                                    ${isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                                    }`
                                }
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                {/* Label: hidden on md, visible on lg+ */}
                                <span className="hidden lg:inline">{label}</span>
                            </NavLink>
                        ))}

                        {portfolioUrl && (
                            <a
                                href={portfolioUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span className="hidden lg:inline">Live</span>
                            </a>
                        )}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Desktop: logout */}
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden lg:inline">Logout</span>
                            </button>
                        </div>

                        {/* Mobile: hamburger */}
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Mobile Drawer ── */}
            <AnimatePresence>
                {drawerOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setDrawerOpen(false)}
                        />

                        {/* Drawer panel — slides in from left */}
                        <motion.aside
                            key="drawer"
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col md:hidden"
                        >
                            {/* Drawer header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                                <div className="flex items-center gap-2.5">
                                    <img src={logo} alt="MyFolio" className="w-8 h-8 rounded-full shadow-sm" />
                                    <span className="font-bold text-slate-900">MyFolio</span>
                                </div>
                                <button
                                    onClick={() => setDrawerOpen(false)}
                                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* User info */}
                            <div className="px-5 py-4 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100" />
                                    ) : (
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-base">
                                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="font-semibold text-slate-900 truncate">{user?.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{user?.email || user?.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Nav links */}
                            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                                {links.map(({ to, icon, label }) => (
                                    <NavItem
                                        key={to}
                                        to={to}
                                        icon={icon}
                                        label={label}
                                        onClick={() => setDrawerOpen(false)}
                                    />
                                ))}

                                {portfolioUrl && (
                                    <a
                                        href={portfolioUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={() => setDrawerOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        View Live Portfolio
                                    </a>
                                )}
                            </nav>

                            {/* Logout at bottom */}
                            <div className="px-3 py-4 border-t border-slate-100">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default DashboardNav;
