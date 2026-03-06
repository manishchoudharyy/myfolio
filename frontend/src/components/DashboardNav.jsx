import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
    LayoutDashboard, Sparkles, FileText, UserCircle2,
    LogOut, ExternalLink, Menu, X, ChevronRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const links = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { to: "/edit", icon: Sparkles, label: "Editor" },
    { to: "/resume", icon: FileText, label: "Resume" },
    { to: "/profile", icon: UserCircle2, label: "Settings" },
];

const DashboardNav = ({ portfolioUrl }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Close drawer when path changes
    useEffect(() => {
        setDrawerOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (drawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [drawerOpen]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <>
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between relative">

                    {/* Logo (Left) */}
                    <div
                        className="flex items-center gap-2.5 cursor-pointer z-10"
                        onClick={() => navigate('/')}
                    >
                        <img src={logo} alt="MyFolio" className="w-6 h-6 rounded" />
                        <span className="font-bold text-slate-900 tracking-tight">MyFolio</span>
                    </div>

                    {/* Desktop Nav (Center) */}
                    <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 z-10">
                        {links.map(({ to, label, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                                    ${isActive
                                        ? "bg-slate-900 text-white shadow-sm"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80"
                                    }`
                                }
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-4 z-10">
                        {portfolioUrl && (
                            <a
                                href={portfolioUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                View Live <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        )}

                        {/* Desktop Avatar Profile Section */}
                        <div className="hidden md:flex flex-row items-center justify-center pl-4 border-l border-slate-200">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                            ) : (
                                <div className="w-8 h-8 bg-slate-900 text-white font-bold text-xs rounded-full flex items-center justify-center shadow-sm">
                                    {user?.name?.charAt(0)?.toUpperCase()}
                                </div>
                            )}
                            <button
                                onClick={handleLogout}
                                className="text-slate-400 hover:text-red-600 ml-3 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Mobile Menu Toggle - Now on Right side */}
                        <button
                            className="md:hidden -mr-2 p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                            onClick={() => setDrawerOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar (Drawer) */}
            <AnimatePresence>
                {drawerOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDrawerOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden"
                        />

                        {/* Sidebar Panel - Now sliding from RIGHT */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed top-0 right-0 bottom-0 w-72 max-w-[80vw] bg-white z-50 shadow-2xl flex flex-col md:hidden"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                                <div className="flex items-center gap-2.5">
                                    <span className="font-bold text-slate-900 tracking-tight">Menu</span>
                                </div>
                                <button
                                    onClick={() => setDrawerOpen(false)}
                                    className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-slate-200 object-cover shadow-sm" />
                                    ) : (
                                        <div className="w-10 h-10 bg-slate-900 text-white font-bold text-sm rounded-full flex items-center justify-center shadow-sm">
                                            {user?.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900 line-clamp-1">{user?.name}</span>
                                        <span className="text-xs text-slate-500 line-clamp-1">{user?.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                                {links.map(({ to, label, icon: Icon }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors
                                            ${isActive
                                                ? "bg-slate-900 text-white shadow-sm"
                                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                            }`
                                        }
                                    >
                                        <Icon className="w-5 h-5 shrink-0" />
                                        {label}
                                    </NavLink>
                                ))}
                            </div>

                            <div className="p-4 border-t border-slate-100 space-y-3">
                                {portfolioUrl && (
                                    <a
                                        href={portfolioUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-between w-full px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-semibold transition-colors border border-blue-100"
                                    >
                                        <div className="flex items-center gap-2">
                                            <ExternalLink className="w-4 h-4" /> View Live
                                        </div>
                                        <ChevronRight className="w-4 h-4" />
                                    </a>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    <LogOut className="w-5 h-5 shrink-0" /> Logout
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default DashboardNav;
