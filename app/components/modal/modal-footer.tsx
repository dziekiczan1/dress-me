import React from 'react';
import { motion } from 'framer-motion';

export default function ModalFooter() {
    return (
        <motion.div
            className={`px-8 py-6 flex justify-end space-x-3 border-t border-white/10`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            Powered by Dress.me
        </motion.div>
    );
}
