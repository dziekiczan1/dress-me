'use client'

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useTryOn } from './TryOnContext';

interface UploadStepProps {
    accentColor?: string;
}

export default function UploadStep({ accentColor = 'rgba(99, 102, 241, 1)' }: UploadStepProps) {
    const { 
        userImage, 
        goToStep, 
        processImages, 
        isDarkMode, 
        error, 
        handleImageUpload 
    } = useTryOn();
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleImageUpload(e.target.files[0]);
        }
    };

    return (
        <div className="p-8 space-y-6">
            {error && (
                <motion.div 
                    className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {error}
                </motion.div>
            )}
            
            <div 
                className="relative border-2 border-dashed p-8 rounded-xl flex flex-col items-center justify-center cursor-pointer group transition-all hover:border-opacity-70 h-80"
                style={{ borderColor: accentColor }}
                onClick={() => fileInputRef.current?.click()}
            >
                {userImage ? (
                    <div className="relative w-full h-64 mb-4">
                        <motion.img 
                            src={userImage} 
                            alt="Your photo" 
                            className="w-full h-full object-contain rounded-lg"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                            <p className="text-white font-medium">Click to change</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 7V17M12 7L16 11M12 7L8 11" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M20 15V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V15" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Drag & Drop or <span style={{color: accentColor}} className="font-medium">Browse Files</span>
                        </p>
                    </>
                )}
                <input 
                    ref={fileInputRef}
                    type="file" 
                    id="user-photo-input"
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileSelect}
                />
            </div>

            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                    Please upload a clear photo of your face for the best results. The image should show your face clearly with good lighting.
                </p>
            </div>

            <div className="pt-4 flex items-center justify-between">
                <motion.button
                    onClick={() => goToStep('preview')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        isDarkMode 
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    Back
                </motion.button>
                
                <motion.button
                    onClick={processImages}
                    disabled={!userImage}
                    className={`px-5 py-2 rounded-lg text-sm font-medium text-white relative overflow-hidden ${!userImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ 
                        background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                    }}
                    whileHover={userImage ? { scale: 1.03 } : {}}
                    whileTap={userImage ? { scale: 0.97 } : {}}
                >
                    {userImage && (
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
                    )}
                    Generate Look
                </motion.button>
            </div>
        </div>
    );
}
