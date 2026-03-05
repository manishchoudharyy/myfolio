import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import {
  Mail, Lock, User, ArrowRight, ArrowLeft,
  Loader2, Eye, EyeOff, Shield, CheckCircle2, Sparkles, AlertCircle
} from "lucide-react";
import logo from "../assets/logo.png";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // "login" | "signup" | "otp" | "name"
  const [view, setView] = useState("login");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [googleReady, setGoogleReady] = useState(false);

  const otpRefs = useRef([]);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  // Google Sign-In — just load SDK & initialize once
  const handleGoogleCallbackRef = useRef(null);

  useEffect(() => {
    const init = () => {
      if (!window.google) return;
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: (res) => handleGoogleCallbackRef.current(res),
      });
      setGoogleReady(true);
    };

    if (window.google) {
      init();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = init;
      document.head.appendChild(script);
    }
  }, []);

  // OTP countdown
  useEffect(() => {
    if (otpTimer <= 0) return;
    const t = setInterval(() => setOtpTimer((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [otpTimer]);

  // ======================== HANDLERS ========================

  const handleGoogleCallback = async (response) => {
    try {
      setLoading(true);
      setError("");
      const res = await authAPI.googleLogin(response.credential);
      const { token, user } = res.data.data;
      login(token, user);
      navigate("/dashboard");
    } catch {
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // Keep ref updated so Google SDK always calls latest version
  handleGoogleCallbackRef.current = handleGoogleCallback;

  // Login with email + password
  const handleLogin = async () => {
    if (!email) return setError("Enter your email address");
    if (!password) return setError("Enter your password");

    try {
      setLoading(true);
      setError("");
      const res = await authAPI.login(email, password);
      const { token, user } = res.data.data;
      login(token, user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Send OTP for signup
  const handleSendOTP = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setError("Enter a valid email address");
    if (password.length < 6) return setError("Password must be at least 6 characters");

    try {
      setLoading(true);
      setError("");
      await authAPI.sendOTP(email);
      setView("otp");
      setOtpTimer(30);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // OTP input handlers
  const handleOTPChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((c, i) => { if (i < 6) newOtp[i] = c; });
    setOtp(newOtp);
    if (pasted.length === 6) otpRefs.current[5]?.focus();
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    const otpStr = otp.join("");
    if (otpStr.length !== 6) return setError("Enter the complete 6-digit OTP");

    try {
      setLoading(true);
      setError("");
      await authAPI.verifyOTP(email, otpStr);
      setView("name");
    } catch (err) {
      setError(err.response?.data?.error?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Complete registration
  const handleRegister = async () => {
    if (!name.trim()) return setError("Enter your name");

    try {
      setLoading(true);
      setError("");
      const res = await authAPI.register(name, email, password);
      const { token, user } = res.data.data;
      login(token, user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Switch to signup (reset relevant fields)
  const goToSignup = () => {
    setView("signup");
    setError("");
    setPassword("");
    setShowPassword(false);
  };

  // Switch to login (reset relevant fields)
  const goToLogin = () => {
    setView("login");
    setError("");
    setPassword("");
    setShowPassword(false);
  };

  // ======================== RENDER ========================

  // Titles per view
  const titles = {
    login: { heading: "Welcome Back", sub: "Login to your account to continue" },
    signup: { heading: "Create Account", sub: "Sign up to start building your portfolio" },
    otp: { heading: "Verify OTP", sub: `Enter the 6-digit code sent to ${email}` },
    name: { heading: "Almost Done!", sub: "Enter your name to complete signup" },
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* LEFT PANEL - BRANDING (Hidden on lg+ screens) */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 relative items-center justify-center p-12 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-slate-800 blur-[120px] opacity-40" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-slate-800 blur-[120px] opacity-40" />
        </div>

        <div className="relative z-10 max-w-xl text-center px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 mb-8 shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Build your dream portfolio.
          </h1>
          <p className="text-base xl:text-lg text-slate-400 font-medium leading-relaxed max-w-md mx-auto">
            Join thousands of professionals who use MyFolio to create stunning, AI-powered portfolios in minutes.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - FORM */}
      <div className="w-full lg:w-1/2 flex flex-col relative bg-white min-h-screen lg:min-h-0">

        {/* Mobile Header (No Back Button) */}
        <div className="absolute flex lg:hidden top-6 left-6 right-6 items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <img src={logo} alt="MyFolio" className="w-8 h-8 rounded-full shadow-sm" />
            <span className="font-black text-slate-900 tracking-tight text-xl">MyFolio</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 py-20 lg:py-12 items-center">
          <div className="w-full max-w-sm sm:max-w-md">

            {/* View Header */}
            <div className="mb-8 sm:mb-10 text-center lg:text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mb-2 sm:mb-3">{titles[view].heading}</h2>
                  <p className="text-slate-500 font-medium text-sm sm:text-base">{titles[view].sub}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 px-4 py-3 sm:py-3.5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-start sm:items-center gap-2.5 overflow-hidden"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0" />
                  <span className="leading-snug">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {/* ================= LOGIN VIEW ================= */}
              {view === "login" && (
                <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <EmailInput email={email} setEmail={setEmail} setError={setError} />
                  <PasswordInput value={password} onChange={setPassword} showPassword={showPassword} toggleShow={() => setShowPassword(!showPassword)} placeholder="Enter your password" label="Password" setError={setError} onEnter={handleLogin} />

                  <button onClick={handleLogin} disabled={loading || !email || !password} className="w-full mt-6 sm:mt-8 py-3.5 sm:py-4 px-6 rounded-2xl bg-slate-900 text-white font-bold text-sm sm:text-base hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm focus:ring-4 focus:ring-slate-200">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Login <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" /></>}
                  </button>

                  <Divider text="or" />
                  <div className="flex justify-center"><GoogleButton ready={googleReady} /></div>

                  <p className="text-center text-sm font-medium text-slate-500 mt-6 sm:mt-8">
                    Don't have an account? <button onClick={goToSignup} className="text-slate-900 font-bold hover:underline transition-colors decoration-2 underline-offset-4">Sign Up</button>
                  </p>
                </motion.div>
              )}

              {/* ================= SIGNUP VIEW ================= */}
              {view === "signup" && (
                <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <EmailInput email={email} setEmail={setEmail} setError={setError} />
                  <PasswordInput value={password} onChange={setPassword} showPassword={showPassword} toggleShow={() => setShowPassword(!showPassword)} placeholder="At least 6 characters" label="Create Password" setError={setError} showStrength />

                  <button onClick={handleSendOTP} disabled={loading || !email || password.length < 6} className="w-full mt-6 sm:mt-8 py-3.5 sm:py-4 px-6 rounded-2xl bg-slate-900 text-white font-bold text-sm sm:text-base hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm focus:ring-4 focus:ring-slate-200">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send OTP <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" /></>}
                  </button>

                  <Divider text="or" />
                  <div className="flex justify-center"><GoogleButton ready={googleReady} /></div>

                  <p className="text-center text-sm font-medium text-slate-500 mt-6 sm:mt-8">
                    Already have an account? <button onClick={goToLogin} className="text-slate-900 font-bold hover:underline transition-colors decoration-2 underline-offset-4">Login</button>
                  </p>
                </motion.div>
              )}

              {/* ================= OTP VIEW ================= */}
              {view === "otp" && (
                <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <div className="flex justify-between gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                    {otp.map((digit, i) => (
                      <input
                        key={i} ref={(el) => (otpRefs.current[i] = el)} type="text" inputMode="numeric" value={digit}
                        onChange={(e) => handleOTPChange(i, e.target.value)} onKeyDown={(e) => handleOTPKeyDown(i, e)} onPaste={i === 0 ? handleOTPPaste : undefined}
                        className="w-[14%] aspect-[3/4] sm:aspect-square md:aspect-auto md:h-16 text-center text-xl sm:text-2xl font-black rounded-lg sm:rounded-2xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all text-slate-900"
                        maxLength={1}
                      />
                    ))}
                  </div>

                  <div className="text-center mb-6 sm:mb-8">
                    {otpTimer > 0 ? (
                      <p className="text-sm font-medium text-slate-500">Resend OTP in <span className="font-bold text-slate-900">{otpTimer}s</span></p>
                    ) : (
                      <button onClick={handleSendOTP} disabled={loading} className="text-sm text-slate-900 font-bold hover:underline decoration-2 underline-offset-4 transition-colors">Resend OTP</button>
                    )}
                  </div>

                  <button onClick={handleVerifyOTP} disabled={loading || otp.join("").length !== 6} className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-slate-900 text-white font-bold text-sm sm:text-base hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm focus:ring-4 focus:ring-slate-200">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Shield className="w-5 h-5" /> Verify OTP</>}
                  </button>

                  <button onClick={() => { setView("signup"); setOtp(["", "", "", "", "", ""]); setError(""); }} className="w-full mt-3 sm:mt-4 py-3 text-sm text-slate-500 hover:text-slate-900 font-bold transition-colors flex items-center justify-center gap-1.5 focus:outline-none">
                    <ArrowLeft className="w-4 h-4" /> Change email
                  </button>
                </motion.div>
              )}

              {/* ================= NAME VIEW ================= */}
              {view === "name" && (
                <motion.div key="name" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-6 sm:mb-8 px-4 py-3 sm:py-3.5 rounded-2xl bg-green-50 border border-green-200">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
                    <span className="text-xs sm:text-sm text-green-700 font-bold">{email} verified</span>
                  </div>

                  <div className="mb-6 sm:mb-8">
                    <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5 sm:mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                      <input
                        type="text" value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="Enter your full name"
                        className="w-full pl-10 sm:pl-12 pr-4 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all text-sm sm:text-base font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
                        onKeyDown={(e) => e.key === "Enter" && handleRegister()} autoFocus
                      />
                    </div>
                  </div>

                  <button onClick={handleRegister} disabled={loading || !name.trim()} className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-slate-900 text-white font-bold text-sm sm:text-base hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm focus:ring-4 focus:ring-slate-200">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" /></>}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================== REUSABLE COMPONENTS ======================

const EmailInput = ({ email, setEmail, setError }) => (
  <div className="mb-4 sm:mb-5">
    <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5 sm:mb-2">Email Address</label>
    <div className="relative">
      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value.toLowerCase());
          setError("");
        }}
        placeholder="Enter your email"
        className="w-full pl-10 sm:pl-12 pr-4 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all text-sm sm:text-base font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
      />
    </div>
  </div>
);

const PasswordInput = ({ value, onChange, showPassword, toggleShow, placeholder, label, setError, showStrength, onEnter }) => (
  <div className="mb-2">
    <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5 sm:mb-2">{label}</label>
    <div className="relative">
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => { onChange(e.target.value); setError(""); }}
        placeholder={placeholder}
        className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all text-sm sm:text-base font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
        onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors p-1"
      >
        {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
      </button>
    </div>
    {/* Password strength bars */}
    {showStrength && value && (
      <div className="mt-2.5 sm:mt-3 flex gap-1.5 sm:gap-2">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-colors ${value.length >= level * 3
              ? level <= 1 ? "bg-red-500"
                : level <= 2 ? "bg-orange-500"
                  : level <= 3 ? "bg-yellow-500"
                    : "bg-green-500"
              : "bg-slate-100"
              }`}
          />
        ))}
      </div>
    )}
  </div>
);

const Divider = ({ text }) => (
  <div className="relative my-6 sm:my-8 w-full">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t-2 border-slate-100" />
    </div>
    <div className="relative flex justify-center text-xs sm:text-sm">
      <span className="bg-white px-3 sm:px-4 text-slate-400 font-bold uppercase tracking-wider">{text}</span>
    </div>
  </div>
);

// Google Sign-In button
const GoogleButton = ({ ready }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ready && ref.current && window.google) {
      window.google.accounts.id.renderButton(ref.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "square",
        logo_alignment: "center",
      });
    }
  }, [ready]);

  // Removing standard CSS widths ensures the button can size naturally, but max-width allows preventing overflow
  return <div className="max-w-full overflow-hidden" ref={ref} />;
};

export default Login;