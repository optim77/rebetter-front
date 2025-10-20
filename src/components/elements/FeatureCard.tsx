import { type JSX } from "react";
import { motion } from "framer-motion";

interface Props {
    icon: JSX.Element;
    title: string;
    text: string;
}

export const FeatureCard =  ({icon, title, text}: Props): JSX.Element => {
    return (
        <motion.div
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition"
            whileHover={{ y: -4 }}
        >
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{text}</p>
        </motion.div>
    );
}