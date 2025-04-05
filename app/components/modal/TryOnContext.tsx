'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type TryOnStep = 'preview' | 'upload' | 'processing' | 'result';

interface TryOnContextType {
    currentStep: TryOnStep;
    direction: number;
    productImage: string | null;
    userImage: string | null;
    resultImage: string | null;
    isProcessing: boolean;
    progressValue: number;
    error: string | null;
    isDarkMode: boolean;
    goToStep: (step: TryOnStep) => void;
    handleImageUpload: (file: File) => void;
    processImages: () => Promise<void>;
    saveImage: () => void;
    shareImage: () => void;
    setError: (error: string | null) => void;
}

const TryOnContext = createContext<TryOnContextType | null>(null);

export const useTryOn = () => {
    const context = useContext(TryOnContext);
    if (!context) {
        throw new Error('useTryOn must be used within a TryOnProvider');
    }
    return context;
};

interface TryOnProviderProps {
    children: ReactNode;
    accentColor?: string;
    productImage: string;
}

export const TryOnProvider = ({ children, accentColor = 'rgba(99, 102, 241, 1)', productImage }: TryOnProviderProps) => {
    const [currentStep, setCurrentStep] = useState<TryOnStep>('preview');
    const [direction, setDirection] = useState<number>(0);
    const [userImage, setUserImage] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [progressValue, setProgressValue] = useState<number>(0);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    // Check system preference for dark mode
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            setIsDarkMode(darkModeQuery.matches);

            const darkModeListener = (e: MediaQueryListEvent) => {
                setIsDarkMode(e.matches);
            };

            darkModeQuery.addEventListener('change', darkModeListener);
            return () => darkModeQuery.removeEventListener('change', darkModeListener);
        }
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isProcessing) {
            interval = setInterval(() => {
                setProgressValue(prev => {
                    const increment = prev < 30 ? 5 : prev < 60 ? 3 : prev < 80 ? 1.5 : 0.5;
                    const newValue = prev + increment;
                    return newValue > 90 ? 90 : newValue;
                });
            }, 150);
        } else if (currentStep === 'result') {
            setProgressValue(100);
        }
        return () => clearInterval(interval);
    }, [isProcessing, currentStep]);

    const goToStep = (step: TryOnStep) => {
        setDirection(
            step === 'preview' && currentStep === 'result' ? -1 :
                step === 'preview' ? -1 : 1
        );
        setCurrentStep(step);
    };

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setUserImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const processImages = async () => {
        if (!productImage || !userImage) {
            setError('Both product and user images are required');
            return;
        }

        setIsProcessing(true);
        setProgressValue(0);
        goToStep('processing');

        try {
            // Simulate API call with timeout - replace with actual KLING AI API
            await new Promise(resolve => setTimeout(resolve, 5000));

            // For demo purposes - using the product image as the result
            // In production, use the actual AI-generated image
            setResultImage(productImage);

            goToStep('result');
        } catch (err: any) {
            setError(`Failed to process images: ${err.message}`);
            goToStep('upload');
        } finally {
            setIsProcessing(false);
        }
    };

    const saveImage = () => {
        if (resultImage) {
            const link = document.createElement('a');
            link.href = resultImage;
            link.download = 'virtual-try-on.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const shareImage = async () => {
        if (resultImage && navigator.share) {
            try {
                const response = await fetch(resultImage);
                const blob = await response.blob();
                const file = new File([blob], 'virtual-try-on.png', { type: 'image/png' });

                await navigator.share({
                    title: 'My Virtual Try-On',
                    text: 'Check out my virtual try-on!',
                    files: [file]
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            saveImage();
        }
    };

    const value = {
        currentStep,
        direction,
        productImage,
        userImage,
        resultImage,
        isProcessing,
        progressValue,
        error,
        isDarkMode,
        goToStep,
        handleImageUpload: (file: File) => handleImageUpload(file),
        processImages,
        saveImage,
        shareImage,
        setError
    };

    return (
        <TryOnContext.Provider value={value}>
            {children}
        </TryOnContext.Provider>
    );
};
