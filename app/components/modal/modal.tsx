'use client'

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TryOnProvider, useTryOn } from './TryOnContext';
import ModalHeading from './modal-heading';
import PreviewStep from './PreviewStep';
import UploadStep from './UploadStep';
import ProcessingStep from './ProcessingStep';
import ResultStep from './ResultStep';

interface ModalProps {
    title?: string;
    onClose?: () => void;
    variant?: 'glass' | 'gradient' | 'neomorphic';
    accentColor?: string;
    productImage: string;
}

interface ModalMessage {
    type: 'openModal' | 'closeModal';
    param1?: string;
}

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
    }
};

const modalVariants = {
    hidden: {
        scale: 0.9,
        opacity: 0,
        y: 10,
        rotateX: -5
    },
    visible: {
        scale: 1,
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
            type: 'spring',
            stiffness: 350,
            damping: 30,
            mass: 1.2,
            duration: 0.5
        }
    },
    exit: {
        scale: 0.95,
        opacity: 0,
        y: 10,
        rotateX: 5,
        transition: {
            duration: 0.25,
            ease: [0.32, 0, 0.67, 0]
        }
    }
};

const contentVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 200 : -200,
        opacity: 0
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: {
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
        }
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 200 : -200,
        opacity: 0,
        transition: {
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
        }
    })
};

function ModalInner({
    title = 'Virtual Try-On',
    onClose,
    variant = 'glass',
    accentColor = 'rgba(99, 102, 241, 1)',
}: ModalProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const {
        currentStep,
        direction,
        isDarkMode,
        setError
    } = useTryOn();

    useEffect(() => {
        const handleMessage = async (event: MessageEvent): Promise<void> => {
            const data = event.data as ModalMessage;
            if (data?.type === 'openModal') {
                setIsModalOpen(true);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [setError]);

    const handleClose = (): void => {
        setIsModalOpen(false);
        window.parent.postMessage(
            { type: 'closeModal' } as ModalMessage,
            '*'
        );
        onClose?.();
    };

    const getModalStyles = () => {
        const baseStyles = "w-11/12 max-w-3xl rounded-2xl relative z-10 overflow-hidden backdrop-blur-md";

        switch(variant) {
            case 'glass':
                return `${baseStyles} ${isDarkMode
                    ? 'bg-black/60 border border-white/10 text-white shadow-[0_8px_32px_0_rgba(255,255,255,0.08)]'
                    : 'bg-white/80 border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]'}`;
            case 'gradient':
                return `${baseStyles} ${isDarkMode
                    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.2)]'
                    : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]'}`;
            case 'neomorphic':
                return `${baseStyles} ${isDarkMode
                    ? 'bg-gray-800 shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#2c2c2c] text-white'
                    : 'bg-gray-100 shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff]'}`;
            default:
                return baseStyles;
        }
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 'preview':
                return 'Virtual Try-On';
            case 'upload':
                return 'Upload Your Photo';
            case 'processing':
                return 'Creating Your Look...';
            case 'result':
                return 'Your Virtual Look';
            default:
                return title;
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isModalOpen && (
                <motion.div
                    className="fixed inset-0 flex justify-center items-center z-50"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <motion.div
                        className="absolute inset-0 bg-black/30 backdrop-blur-md transition-all duration-700"
                        onClick={handleClose}
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{
                            opacity: 1,
                            backdropFilter: 'blur(12px)',
                            transition: { duration: 0.5 }
                        }}
                        exit={{
                            opacity: 0,
                            backdropFilter: 'blur(0px)',
                            transition: { duration: 0.3 }
                        }}
                    />

                    <motion.div
                        className={`${getModalStyles()} min-h-[70vh]`}
                        style={{
                            boxShadow: `0 0 25px -5px ${accentColor}40`, transition: 'box-shadow 1.2s ease-out'
                        }}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                    >

                        <ModalHeading
                            title={getStepTitle()}
                            onClose={handleClose}
                            accentColor={accentColor}
                        />

                        <motion.div layout className="overflow-hidden">
                            <AnimatePresence custom={direction} initial={false} mode="popLayout">
                                <motion.div
                                    key={currentStep}
                                    custom={direction}
                                    variants={contentVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                >
                                    {currentStep === 'preview' && <PreviewStep accentColor={accentColor}/>}
                                    {currentStep === 'upload' && <UploadStep accentColor={accentColor}/>}
                                    {currentStep === 'processing' && <ProcessingStep accentColor={accentColor}/>}
                                    {currentStep === 'result' && <ResultStep accentColor={accentColor}/>}
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>

                    </motion.div>
                </motion.div>)}
        </AnimatePresence>);
}

export default function Modal(props: ModalProps) {
    return (<TryOnProvider accentColor={props.accentColor} productImage={props.productImage}>
            <ModalInner {...props} />
        </TryOnProvider>);
}
