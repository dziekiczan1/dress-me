import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ModalContentProps {
    children: ReactNode;
    isDarkMode?: boolean;
}

export default function ModalContent({ children, isDarkMode = false }: ModalContentProps) {
    return (
        <motion.div
            className={`p-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            {children}
        </motion.div>
    );
}
