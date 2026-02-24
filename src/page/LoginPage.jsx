import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const { login, isAuthenticated, error: authError, loading } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/account/profile");
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            // login is async, so we need to await it
            await login(formData.email, formData.password);

            // If successful, the useEffect above will handle navigation
            // due to isAuthenticated becoming true
        } catch (err) {
            // Set error from the catch
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
            <div className="max-w-md w-full">
                {/* Nike Logo */}
                <div className="text-center mb-8">
                    <svg
                        className="h-12 w-14 mx-auto"
                        viewBox="0 0 69 32"
                        fill="currentColor"
                    >
                        <path d="M68.56 4L18.4 25.36Q12.16 28 7.92 28q-4.8 0-6.96-3.36-1.36-2.16-.8-5.48t2.96-7.08q2-3.04 6.56-8-1.6 2.56-2.24 5.28-1.2 5.12 2.16 7.52Q11.2 18 14 18q2.24 0 5.04-.72z"></path>
                    </svg>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-4">
                        YOUR ACCOUNT FOR EVERYTHING NIKE
                    </h1>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {authError && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                            {authError}
                        </div>
                    )}



                    <div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email address"
                            autoComplete="email"
                            required
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Password"
                            autoComplete="current-password"
                            required
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-5 h-5 rounded border-2 border-[#CCCCCC] checked:bg-black checked:border-black"
                            />
                            <span className="ml-2 text-[#757575]">Keep me signed in</span>
                        </label>
                        <Link to="/forgot-password" className="text-[#757575] hover:text-black underline">
                            Forgotten your password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-[#111111] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing In...
                            </>
                        ) : (
                            "SIGN IN"
                        )}
                    </button>

                    <p className="text-center text-sm text-[#757575]">
                        By logging in, you agree to Nike's{" "}
                        <Link to="/privacy" className="underline hover:text-black">
                            Privacy Policy
                        </Link>{" "}
                        and{" "}
                        <Link to="/terms" className="underline hover:text-black">
                            Terms of Use
                        </Link>
                        .
                    </p>
                </form>

                {/* Sign Up Link */}
                <div className="mt-8 text-center">
                    <p className="text-[#757575]">
                        Not a Member?{" "}
                        <Link
                            to="/account/register"
                            className="text-black underline hover:text-[#757575]"
                        >
                            Join Us.
                        </Link>
                    </p>
                </div>

                {/* Back to Home */}
                <div className="mt-4 text-center">
                    <Link
                        to="/"
                        className="text-[#757575] text-sm hover:text-black underline"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}