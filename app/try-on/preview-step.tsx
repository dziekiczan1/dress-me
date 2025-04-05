'use client'

import { motion } from 'framer-motion';
import { useTryOn } from './try-on-context';
import GradientButton from '@/app/components/common/gradient-button';

export default function PreviewStep() {
    const { productImage, goToStep, error } = useTryOn();

    return (
        <div className="p-8 space-y-6">
            <div className="flex flex-col items-center space-y-6">
                {error && (
                    <motion.div
                        className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {error}
                    </motion.div>
                )}

                {productImage ? (
                    <div className="relative w-full h-80 overflow-hidden rounded-xl">
                        <motion.img
                            src={productImage}
                            alt="Product"
                            className="w-full h-full object-contain"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                ) : (
                    <div className="w-full h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
                        <p className="text-gray-500 dark:text-gray-400">Product image not available</p>
                    </div>
                )}

                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                        Ready to try this on?
                    </h3>
                    <p className={`text-sm mb-6 text-gray-300`}>
                        See how this would look on you with our AI-powered virtual try-on
                    </p>

                    <GradientButton
                        onClickAction={() => goToStep('upload')}
                        disabled={!productImage}
                    >
                        Try It On
                    </GradientButton>
                </motion.div>
            </div>
        </div>
    );
}
