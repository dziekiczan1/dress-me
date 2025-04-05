'use client'

import { motion } from 'framer-motion';
import { useTryOn } from './TryOnContext';

interface ProcessingStepProps {
    accentColor?: string;
}

const processingVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: { type: "spring", duration: 1.5, bounce: 0 },
            opacity: { duration: 0.2 }
        }
    }
};

export default function ProcessingStep({ accentColor = 'rgba(99, 102, 241, 1)' }: ProcessingStepProps) {
    const { progressValue, isDarkMode } = useTryOn();

    return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[300px] space-y-8">
            <div className="relative w-80 h-80">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                        strokeWidth="4"
                        fill="none"
                    />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke={accentColor}
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: progressValue / 100 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{ 
                            strokeDasharray: "251.2",
                            strokeDashoffset: "0",
                            transformOrigin: "center",
                            rotate: "-90deg"
                        }}
                    />
                    
                    <text
                        x="50"
                        y="50"
                        fontSize="18"
                        fontWeight="500"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fill={isDarkMode ? "#fff" : "#333"}
                    >
                        {Math.round(progressValue)}%
                    </text>
                </svg>
                
                <div className="absolute inset-0 -m-2">
                    {[0, 60, 120, 180, 240, 300].map((degree, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full"
                            style={{ 
                                backgroundColor: accentColor,
                                left: `calc(50% + ${40 * Math.cos(degree * (Math.PI / 180))}px)`,
                                top: `calc(50% + ${40 * Math.sin(degree * (Math.PI / 180))}px)`,
                            }}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.7, 1, 0.7]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="text-center space-y-3">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                    Creating your virtual look
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Our AI is working its magic to generate your virtual try-on
                </p>
            </div>
            
            <div className="w-full max-w-md">
                <motion.div
                    className="text-center text-xs text-gray-500 dark:text-gray-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <p>Analyzing clothing style and pattern...</p>
                </motion.div>
            </div>
        </div>
    );
}
