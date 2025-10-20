import { ArrowRight, Star, Zap, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { t } from "i18next";
import { FeatureCard } from "@/components/elements/FeatureCard.tsx";
import { Footer } from "@/components/elements/Footer.tsx";
import { ContactForm } from "@/components/elements/ContactForm.tsx";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">

            <nav className="flex items-center justify-between px-6 py-4 border-b">
                <h1 className="text-2xl font-bold text-indigo-600">ReBetter</h1>
                <div className="flex gap-4">
                    <a href="#features" className="text-gray-700 hover:text-indigo-600">
                        Features
                    </a>
                    <a href="#pricing" className="text-gray-700 hover:text-indigo-600">
                        Pricing
                    </a>
                    <a href="#contact" className="text-gray-700 hover:text-indigo-600">
                        Contact
                    </a>
                    <a
                        href="/login"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Log in
                    </a>
                </div>
            </nav>

            <section className="flex flex-col items-center text-center py-24 px-6 bg-gradient-to-b from-indigo-50 to-white">
                <motion.h1
                    className="text-5xl md:text-6xl font-bold text-gray-900 mb-4"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {t("landing.headline")}
                </motion.h1>
                <p className="text-gray-600 text-lg md:w-1/2">
                    {t("landing.subtext")}
                </p>
                <div className="mt-8 flex gap-4 text-white">
                    <a
                        href="/register"
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2"
                    >
                        {t("action.get_started")} <ArrowRight className="w-4 h-4"/>
                    </a>
                    <a
                        href="#features"
                        className="border border-gray-300 px-6 py-3 rounded-xl text-gray-700 hover:border-indigo-400 transition"
                    >
                        {t("action.learn_more")}
                    </a>
                </div>
                <img
                    src="https://elfsight.com/wp-content/uploads/2024/03/get-google-customer-reviews-api-featured-image.png"
                    alt="Illustration"
                    className="w-full max-w-3xl mt-16"
                />
            </section>

            <section id="features" className="py-20 bg-gray-50 px-6">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                    {t("landing.why_rebetter")}
                </h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <FeatureCard
                        icon={<Star className="text-indigo-600 w-8 h-8" />}
                        title={t("landing.automated_review_requests")}
                        text={t("landing.automated_review_requests_description")}
                    />
                    <FeatureCard
                        icon={<Zap className="text-indigo-600 w-8 h-8" />}
                        title={t("landing.smart_feedback_filter")}
                        text={t("landing.smart_feedback_filter_description")}
                    />
                    <FeatureCard
                        icon={<BarChart3 className="text-indigo-600 w-8 h-8" />}
                        title={t("landing.real_time_analytics")}
                        text={t("landing.real_time_analytics_description")}
                    />
                </div>
            </section>


            <section className="py-20 text-center bg-indigo-600 text-white">
                <h2 className="text-4xl font-bold mb-6">
                    {t("landing.cta_section.head")}
                </h2>
                <p className="text-lg mb-8">
                    {t("landing.cta_section.description")}
                </p>
                <a
                    href="/register"
                    className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-medium hover:bg-gray-100 transition"
                >
                    {t("action.get_started")}
                </a>
            </section>

            <ContactForm />

            <Footer />
        </div>
    );
}



