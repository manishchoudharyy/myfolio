import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { publicAPI } from "../services/api";
import LivePreview from "../components/editor/LivePreview";

const PublicPortfolio = () => {
    const { subdomain } = useParams();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchPortfolio();
    }, [subdomain]);

    const fetchPortfolio = async () => {
        try {
            const res = await publicAPI.getPortfolio(subdomain);
            setPortfolio(res.data.data);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !portfolio) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-slate-900 mb-3">404</h1>
                    <p className="text-slate-500 mb-6">Portfolio not found</p>
                    <a href="/" className="text-blue-600 font-medium hover:text-blue-700">
                        ← Go to MyFolio
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <LivePreview data={portfolio.data} templateId={portfolio.templateId} templateSlug={portfolio.templateSlug} />
        </div>
    );
};

export default PublicPortfolio;
