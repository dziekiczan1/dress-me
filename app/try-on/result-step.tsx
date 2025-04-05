'use client'

import { motion } from 'framer-motion';
import { useTryOn } from './try-on-context';
import {ACCENT_COLOR} from "@/app/components/modal/modal";

export default function ResultStep() {
    const { resultImage, goToStep, saveImage, shareImage } = useTryOn();

    return (
        <div className="p-8 space-y-6">
            <div className="flex flex-col items-center space-y-6">
                {resultImage ? (
                    <div className="relative w-full overflow-hidden rounded-xl">
                        <motion.img
                            src={resultImage}
                            alt="Virtual try-on result"
                            className="w-full object-contain max-h-80"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                        <motion.div
                            className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">AI Generated</span>
                        </motion.div>
                    </div>
                ) : (
                    <div className="w-full h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
                        <p className="text-gray-500 dark:text-gray-400">Result image not available</p>
                    </div>
                )}

                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                        Your Virtual Look is Ready!
                    </h3>
                    <p className={`text-sm mb-6 text-gray-300`}>
                        Here's how this outfit would look on you. Save the image or try with another photo.
                    </p>

                    <div className="flex flex-wrap justify-center gap-3">
                        <motion.button
                            onClick={() => goToStep('upload')}
                            className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 bg-gray-800 text-gray-300 hover:bg-gray-700`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 12L3 12M3 12L10 19M3 12L10 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Try Another Photo
                        </motion.button>

                        <motion.button
                            onClick={saveImage}
                            className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 bg-gray-800 text-gray-300 hover:bg-gray-700`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 17H17.01M17.4 14H18C19.1046 14 20 14.8954 20 16V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V16C4 14.8954 4.89543 14 6 14H6.6M12 15V3M12 15L8 11M12 15L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Download
                        </motion.button>

                        <motion.button
                            onClick={shareImage}
                            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white flex items-center gap-2 relative overflow-hidden"
                            style={{
                                background: `linear-gradient(135deg, ${ACCENT_COLOR}, ${ACCENT_COLOR}cc)`,
                            }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
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
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.59 13.51L12 16.94L15.41 13.51M12 4.52V16.94M5 20H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Share Look
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
