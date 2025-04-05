import React from 'react';
import { motion } from 'framer-motion';

interface ModalFooterProps {
    onClose: () => void;
    accentColor?: string;
    isDarkMode?: boolean;
}

export default function ModalFooter({ onClose, accentColor = 'rgba(99, 102, 241, 1)', isDarkMode = false }: ModalFooterProps) {
    const buttonVariants = {
        hover: {
            scale: 1.03,
            transition: { duration: 0.2 }
        },
        tap: {
            scale: 0.97,
            transition: { duration: 0.1 }
        }
    };

    return (
        <motion.div
            className={`px-8 py-6 flex justify-end space-x-3 ${isDarkMode ? 'border-t border-white/10' : 'border-t border-black/5'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <motion.button
                onClick={onClose}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    isDarkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
            >
                Cancel
            </motion.button>

            <motion.button
                className="px-5 py-2.5 rounded-lg font-medium text-sm text-white relative overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
            >
                {/* Modern shine effect */}
                <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 skew-x-12"
                    initial={{ left: '-100%' }}
                    animate={{ left: '100%' }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "mirror",
                        duration: 2,
                        ease: "easeInOut"
                    }}
                />
                Upload
            </motion.button>
        </motion.div>
    );
}
