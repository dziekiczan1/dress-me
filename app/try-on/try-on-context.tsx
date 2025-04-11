'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {optimizeImage} from "@/app/utils/image-utils";

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
    productImage: string;
}

export const TryOnProvider = ({ children, productImage }: TryOnProviderProps) => {
    const [currentStep, setCurrentStep] = useState<TryOnStep>('preview');
    const [direction, setDirection] = useState<number>(0);
    const [userImage, setUserImage] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [progressValue, setProgressValue] = useState<number>(0);
    const [taskId, setTaskId] = useState<string | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let progressInterval: NodeJS.Timeout;

        if (isProcessing && taskId) {
            setProgressValue(10);

            progressInterval = setInterval(() => {
                setProgressValue(prev => {
                    const increment =
                        prev < 10 ? 2.0 :
                            prev < 20 ? 1.5 :
                                prev < 40 ? 1.0 :
                                    prev < 70 ? 0.5 :
                                        0.2;

                    const newValue = prev + increment;
                    return newValue > 95 ? 95 : newValue;
                });
            }, 200);

            interval = setInterval(async () => {
                try {
                    const response = await fetch(`/api/tryon/status?taskId=${taskId}`);
                    const status = await response.json();

                    console.log('Status response:', status);

                    if (status.data?.task_status === 'succeed') {
                        console.log('Task succeeded. Task result:', status.data.task_result);

                        const imageObject = status.data.task_result.images[0];

                        if (imageObject && typeof imageObject === 'object' && imageObject.url) {
                            setResultImage(imageObject.url);
                            console.log('Setting result image URL:', imageObject.url);
                        } else {
                            console.error('Unexpected image result format:', imageObject);
                            setError('Failed to get the result image URL');
                        }

                        clearInterval(progressInterval);
                        setProgressValue(100);
                        setIsProcessing(false);
                        goToStep('result');
                        clearInterval(interval);
                    }

                    else if (status.data?.task_status === 'failed') {
                        clearInterval(progressInterval);
                        setError(`Processing failed: ${status.data.task_status_msg}`);
                        setIsProcessing(false);
                        goToStep('upload');
                        clearInterval(interval);
                    }

                    else if (status.data?.task_status === 'processing') {
                        if (status.data.progress) {
                            setProgressValue(Math.min(90, status.data.progress));
                        }
                    }
                } catch (err: any) {
                    clearInterval(progressInterval);
                    console.error('Error checking status:', err);
                    setError(`Failed to check status: ${err.message}`);
                    setIsProcessing(false);
                    goToStep('upload');
                    clearInterval(interval);
                }
            }, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
            if (progressInterval) clearInterval(progressInterval);
        };
    }, [isProcessing, taskId]);

    const goToStep = (step: TryOnStep) => {
        setDirection(
            step === 'preview' && currentStep === 'result' ? -1 :
                step === 'preview' ? -1 : 1
        );
        setCurrentStep(step);
    };

    const handleImageUpload = async (file: File) => {
        try {
            setError(null);

            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                setError('Please upload a valid image file (JPG, JPEG, PNG, or GIF)');
                return;
            }

            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                setError('Image size should be less than 5MB');
                return;
            }

            const optimizedImage = await optimizeImage(file);
            setUserImage(optimizedImage);
        } catch (err: any) {
            console.error('Error handling image upload:', err);
            setError(`Failed to process the uploaded image: ${err.message}`);
        }
    };

    const getBase64FromUrl = async (url: string): Promise<string> => {
        let parentOrigin = '';

        if (window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0) {
            parentOrigin = window.location.ancestorOrigins[0];
        }

        let imageUrl = url;
        if (url.includes('/_next/image')) {
            const urlObj = new URL(url);
            const originalUrl = urlObj.searchParams.get('url');
            if (originalUrl) {
                if (originalUrl.startsWith('/')) {
                    imageUrl = `${parentOrigin}${originalUrl}`;
                } else {
                    imageUrl = originalUrl;
                }
            }
        }

        const isCrossOrigin = new URL(imageUrl).origin !== window.location.origin;
        const fetchUrl = isCrossOrigin
            ? `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`
            : imageUrl;

        try {
            const response = await fetch(fetchUrl, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
            }

            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = (e) => reject(new Error(`FileReader error: ${e}`));
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error fetching image:', error);
            throw error;
        }
    };

    const extractBase64Content = (dataUrl: string): string => {
        return dataUrl.split(',')[1];
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
            const productImageBase64 = extractBase64Content(await getBase64FromUrl(productImage));
            const userImageBase64 = extractBase64Content(userImage);

            const response = await fetch('/api/tryon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    humanImage: userImageBase64,
                    clothImage: productImageBase64
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to start processing');
            }

            setTaskId(result.taskId);
        } catch (err: any) {
            console.error('Error processing images:', err);
            setError(`Failed to process images: ${err.message}`);
            setIsProcessing(false);
            goToStep('upload');
        }
    };

    const saveImage = () => {
        if (resultImage) {
            const downloadUrl = resultImage.replace(
                /^data:image\/[^;]+/,
                'data:application/octet-stream'
            );

            window.location.href = downloadUrl;
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
        goToStep,
        handleImageUpload,
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
