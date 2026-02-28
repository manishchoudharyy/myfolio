import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import {
  Phone, Lock, User, ArrowRight, ArrowLeft,
  Loader2, Eye, EyeOff, Shield, CheckCircle2
} from "lucide-react";
import logo from "../assets/logo.png";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // "login" | "signup" | "otp" | "name"
  const [view, setView] = useState("login");

  // Form fields
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [sessionId, setSessionId] = useState("");
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

  // Login with phone + password
  const handleLogin = async () => {
    if (phone.length !== 10) return setError("Enter a valid 10-digit number");
    if (!password) return setError("Enter your password");

    try {
      setLoading(true);
      setError("");
      const res = await authAPI.login(phone, password);
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
    if (phone.length !== 10) return setError("Enter a valid 10-digit number");
    if (password.length < 6) return setError("Password must be at least 6 characters");

    try {
      setLoading(true);
      setError("");
      const res = await authAPI.sendOTP(phone);
      setSessionId(res.data.data.sessionId);
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
      await authAPI.verifyOTP(phone, sessionId, otpStr);
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
      const res = await authAPI.register(name, phone, password);
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
    otp: { heading: "Verify OTP", sub: `Enter the 6-digit code sent to +91 ${phone}` },
    name: { heading: "Almost Done!", sub: "Enter your name to complete signup" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden"
      >
        {/* Top gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

        <div className="p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-7">
            <div className="flex items-center justify-center gap-2 mb-5">
              <img src={logo} alt="MyFolio" className="w-10 h-10 rounded-full shadow-md" />
              <span className="text-2xl font-bold text-slate-900 tracking-tight">MyFolio</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-2xl font-bold text-slate-900 mb-1">{titles[view].heading}</h1>
                <p className="text-slate-500 text-sm">{titles[view].sub}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* ================= LOGIN VIEW ================= */}
            {view === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Phone */}
                <PhoneInput phone={phone} setPhone={setPhone} setError={setError} />

                {/* Password */}
                <PasswordInput
                  value={password}
                  onChange={setPassword}
                  showPassword={showPassword}
                  toggleShow={() => setShowPassword(!showPassword)}
                  placeholder="Enter your password"
                  label="Password"
                  setError={setError}
                  onEnter={handleLogin}
                />

                {/* Login button */}
                <button
                  onClick={handleLogin}
                  disabled={loading || phone.length !== 10 || !password}
                  className="w-full mt-5 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Login <ArrowRight className="w-4 h-4" /></>}
                </button>

                {/* OR Divider */}
                <Divider text="or" />

                {/* Google */}
                <div className="flex justify-center mb-4">
                  <GoogleButton ready={googleReady} />
                </div>

                {/* Switch to signup */}
                <p className="text-center text-sm text-slate-500 mt-5">
                  Don't have an account?{" "}
                  <button onClick={goToSignup} className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
                    Sign Up
                  </button>
                </p>
              </motion.div>
            )}

            {/* ================= SIGNUP VIEW ================= */}
            {view === "signup" && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Phone */}
                <PhoneInput phone={phone} setPhone={setPhone} setError={setError} />

                {/* Password */}
                <PasswordInput
                  value={password}
                  onChange={setPassword}
                  showPassword={showPassword}
                  toggleShow={() => setShowPassword(!showPassword)}
                  placeholder="At least 6 characters"
                  label="Create Password"
                  setError={setError}
                  showStrength
                />

                {/* Send OTP button */}
                <button
                  onClick={handleSendOTP}
                  disabled={loading || phone.length !== 10 || password.length < 6}
                  className="w-full mt-5 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
                </button>

                {/* OR Divider */}
                <Divider text="or" />

                {/* Google */}
                <div className="flex justify-center mb-4">
                  <GoogleButton ready={googleReady} />
                </div>

                {/* Switch to login */}
                <p className="text-center text-sm text-slate-500 mt-5">
                  Already have an account?{" "}
                  <button onClick={goToLogin} className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
                    Login
                  </button>
                </p>
              </motion.div>
            )}

            {/* ================= OTP VIEW ================= */}
            {view === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* OTP boxes */}
                <div className="flex justify-center gap-2.5 mb-5">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOTPChange(i, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(i, e)}
                      onPaste={i === 0 ? handleOTPPaste : undefined}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800"
                      maxLength={1}
                    />
                  ))}
                </div>

                {/* Resend */}
                <div className="text-center mb-5">
                  {otpTimer > 0 ? (
                    <p className="text-sm text-slate-400">
                      Resend OTP in <span className="font-bold text-blue-600">{otpTimer}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={handleSendOTP}
                      disabled={loading}
                      className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                {/* Verify button */}
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.join("").length !== 6}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Shield className="w-4 h-4" /> Verify OTP</>}
                </button>

                {/* Back */}
                <button
                  onClick={() => { setView("signup"); setOtp(["", "", "", "", "", ""]); setError(""); }}
                  className="w-full mt-3 py-2.5 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" /> Change number
                </button>
              </motion.div>
            )}

            {/* ================= NAME VIEW (final signup step) ================= */}
            {view === "name" && (
              <motion.div
                key="name"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Verified badge */}
                <div className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl bg-green-50 border border-green-100">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-sm text-green-700 font-medium">+91 {phone} verified successfully</span>
                </div>

                {/* Name input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(""); }}
                      placeholder="Enter your full name"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
                      onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                      autoFocus
                    />
                  </div>
                </div>

                {/* Create account button */}
                <button
                  onClick={handleRegister}
                  disabled={loading || !name.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to home */}
          <div className="text-center mt-6">
            <a href="/" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
              ← Back to home
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ====================== REUSABLE COMPONENTS ======================

const PhoneInput = ({ phone, setPhone, setError }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
    <div className="relative flex items-center">
      <div className="absolute left-0 flex items-center pl-4 pointer-events-none">
        <span className="text-slate-500 font-medium text-sm border-r border-slate-200 pr-3">+91</span>
      </div>
      <Phone className="absolute left-20 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="tel"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
          setError("");
        }}
        placeholder="Enter 10-digit number"
        className="w-full pl-26 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
        maxLength={10}
      />
    </div>
  </div>
);

const PasswordInput = ({ value, onChange, showPassword, toggleShow, placeholder, label, setError, showStrength, onEnter }) => (
  <div className="mb-1">
    <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
    <div className="relative">
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => { onChange(e.target.value); setError(""); }}
        placeholder={placeholder}
        className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
        onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
      >
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
    {/* Password strength bars */}
    {showStrength && value && (
      <div className="mt-2 flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors ${value.length >= level * 3
              ? level <= 1 ? "bg-red-400"
                : level <= 2 ? "bg-orange-400"
                  : level <= 3 ? "bg-yellow-400"
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
  <div className="relative my-5">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-slate-200" />
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="bg-white px-4 text-slate-400 font-medium">{text}</span>
    </div>
  </div>
);

// Google Sign-In button — re-renders every time it mounts
const GoogleButton = ({ ready }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ready && ref.current && window.google) {
      window.google.accounts.id.renderButton(ref.current, {
        theme: "outline",
        size: "large",
        width: 360,
        text: "continue_with",
        shape: "rectangular",
      });
    }
  }, [ready]);

  return <div ref={ref} />;
};

export default Login;