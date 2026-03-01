import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add auth token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    googleLogin: (credential) => api.post("/auth/google", { credential }),
    sendOTP: (phone) => api.post("/auth/send-otp", { phone }),
    verifyOTP: (phone, sessionId, otp) => api.post("/auth/verify-otp", { phone, sessionId, otp }),
    register: (name, phone, password) => api.post("/auth/register", { name, phone, password }),
    login: (phone, password) => api.post("/auth/login", { phone, password }),
};

// User APIs
export const userAPI = {
    getMe: () => api.get("/user/me"),
    update: (formData) => api.patch("/user/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    }),
    changePassword: (currentPassword, newPassword) =>
        api.patch("/user/change-password", { currentPassword, newPassword }),
    deletePortfolio: () => api.delete("/user/portfolio"),
};

// Template APIs
export const templateAPI = {
    getAll: () => api.get("/templates"),
};

// Portfolio APIs
export const portfolioAPI = {
    create: (data) => api.post("/portfolio/create", data),
    get: (id) => api.get(`/portfolio/${id}`),
    getMyPortfolio: () => api.get("/portfolio/user/me"),
    update: (id, data) => api.patch(`/portfolio/${id}`, { data }),
    checkSubdomain: (subdomain) => api.post("/portfolio/check-subdomain", { subdomain }),
    publish: (portfolioId, subdomain) => api.post("/portfolio/publish", { portfolioId, subdomain }),
};

// AI APIs
export const aiAPI = {
    generate: (portfolioId, section, userInput) =>
        api.post("/ai/generate", { portfolioId, section, userInput }),
    resumeParse: (file) => {
        const formData = new FormData();
        formData.append("resume", file);
        return api.post("/ai/resume-parse", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    polish: (data) => api.post("/ai/polish", { data }),
    onboard: (message, sessionId) =>
        api.post("/ai/onboard", { message, sessionId }),
    refine: (portfolioId, message, sessionId) =>
        api.post("/ai/refine", { portfolioId, message, sessionId }),
    getSession: () => api.get("/ai/session"),
};

// Dashboard APIs
export const dashboardAPI = {
    get: () => api.get("/dashboard"),
};

// Public APIs
export const publicAPI = {
    getPortfolio: (subdomain) => api.get(`/public/${subdomain}`),
};

// Upload APIs
export const uploadAPI = {
    image: (file) => {
        const formData = new FormData();
        formData.append("image", file);
        return api.post("/upload/image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};

// Resume APIs
export const resumeAPI = {
    getMy: () => api.get("/resume/my"),
    getHistory: () => api.get("/resume/history"),
    upload: (file) => {
        const formData = new FormData();
        formData.append("resume", file);
        return api.post("/resume/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    delete: () => api.delete("/resume/delete"),
};

export default api;
