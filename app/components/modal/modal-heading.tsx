'use client'

import { motion } from 'framer-motion';
import { useTryOn } from './TryOnContext';

interface ModalHeadingProps {
    title: string;
    onClose: () => void;
    accentColor?: string;
}

export default function ModalHeading({
    title,
    onClose,
    accentColor = 'rgba(99, 102, 241, 1)'
}: ModalHeadingProps) {
    const { isDarkMode, currentStep } = useTryOn();

    const StepIndicator = () => {
        const steps = ['preview', 'upload', 'result'];
        const currentIndex = steps.indexOf(currentStep);

        return (
            <div className="flex items-center space-x-1.5">
                {steps.map((_, index) => (
                    <motion.div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full ${
                            index === currentIndex
                                ? 'bg-white'
                                : index < currentIndex
                                    ? 'bg-white/80'
                                    : 'bg-white/30'
                        }`}
                        animate={index === currentIndex ? { scale: [1, 1.5, 1] } : {}}
                        transition={{
                            duration: 0.5,
                            repeat: index === currentIndex ? Infinity : 0,
                            repeatType: "reverse"
                        }}
                    />
                ))}
            </div>
        );
    };

    return (
        <motion.div
            className={`px-8 py-6 flex justify-between items-center ${isDarkMode ? 'border-b border-white/10' : 'border-b border-black/5'}`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <div className="flex flex-col gap-y-4">
                <motion.h2
                    className="text-xl font-medium"
                    style={{
                        backgroundImage: `linear-gradient(90deg, ${accentColor === 'rgba(255,255,255,1)' ? '#6366f1' : accentColor}, ${accentColor === 'rgba(255,255,255,1)' ? '#6366f188' : accentColor + '88'})`,
                    }}
                >
                    {title}
                </motion.h2>
                <StepIndicator/>
            </div>

            <motion.button
                onClick={onClose}
                className={`p-2 rounded-full transition-all hover:bg-black/5 ${isDarkMode ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-700'}`}
                aria-label="Close modal"
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </motion.button>
        </motion.div>
    );
}
