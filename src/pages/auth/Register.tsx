import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";

export default function Register() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <motion.div
                className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
                    Create your ReBetter account
                </h1>

                <form className="flex flex-col gap-4">
                    <div>
                        <label className="block text-gray-600 mb-1">Full Name</label>
                        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400">
                            <User className="text-gray-400 w-5 h-5 mr-2" />
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="flex-1 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Email</label>
                        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400">
                            <Mail className="text-gray-400 w-5 h-5 mr-2" />
                            <input
                                type="email"
                                placeholder="you@company.com"
                                className="flex-1 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Password</label>
                        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400">
                            <Lock className="text-gray-400 w-5 h-5 mr-2" />
                            <input
                                type="password"
                                placeholder="********"
                                className="flex-1 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Sign up
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-indigo-600 font-medium hover:underline"
                        >
                            Log in
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
