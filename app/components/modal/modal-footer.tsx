import React from 'react';
import { motion } from 'framer-motion';
import Image from "next/image";

export default function ModalFooter() {
    return (
        <motion.div
            className={`px-4 py-6 flex items-center justify-end space-x-3 border-t border-white/10`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <p className={`text-base mr-1`}>Powered by</p>
            <Image src="/dress-me.png" alt={`Dress me`} width={80} height={40}/>
        </motion.div>
    );
}
