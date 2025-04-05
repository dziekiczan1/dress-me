import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ModalContentProps {
    children: ReactNode;
}

export default function ModalContent({ children }: ModalContentProps) {
    return (
        <motion.div
            className={`p-8 text-gray-300`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            {children}
        </motion.div>
    );
}
