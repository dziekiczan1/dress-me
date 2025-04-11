'use client'

import {motion, AnimatePresence} from 'framer-motion';
import {contentVariants, modalVariants, overlayVariants} from './animations';
import {TryOnProvider, useTryOn} from '@/app/try-on';
import ModalHeading from './modal-heading';
import PreviewStep from '../../try-on/preview-step';
import UploadStep from '../../try-on/upload-step';
import ProcessingStep from '../../try-on/processing-step';
import ResultStep from '../../try-on/result-step';
import {useModalMessaging} from "@/app/hooks/useModalMessaging";
import ModalFooter from "@/app/components/modal/modal-footer";
import ErrorBoundary from "@/app/components/common/error-boundary";

export const ACCENT_COLOR = 'rgba(99, 102, 241, 1)';

interface ModalProps {
    title?: string;
    onClose?: () => void;
    productImage: string;
}

function ModalInner({
    title = 'Virtual Try-On', onClose,
}: ModalProps) {
    const {
        currentStep, direction, setError
    } = useTryOn();

    const {isModalOpen, closeModal} = useModalMessaging((error) => setError(error));

    const handleClose = (): void => {
        closeModal();
        onClose?.();
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

    const modalErrorFallback = (
        <div className="p-8 flex flex-col items-center justify-center h-[60vh]">
            <div className="text-center">
                <div className="mb-6">
                    <svg className="w-16 h-16 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Try-On Process Failed</h3>
                <p className="text-gray-300 mb-5">We encountered an issue with the virtual try-on process.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    return (<AnimatePresence mode="wait">
        {isModalOpen && (<motion.div
            className="fixed inset-0 flex justify-center items-center z-50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            <motion.div
                className="absolute inset-0 bg-black/30 backdrop-blur-md transition-all duration-700"
                onClick={handleClose}
                initial={{opacity: 0, backdropFilter: 'blur(0px)'}}
                animate={{
                    opacity: 1, backdropFilter: 'blur(12px)', transition: {duration: 0.5}
                }}
                exit={{
                    opacity: 0, backdropFilter: 'blur(0px)', transition: {duration: 0.3}
                }}
            />

            <motion.div
                className={`w-11/12 max-w-3xl rounded-2xl relative z-10 overflow-hidden backdrop-blur-md 
                        bg-black/60 border border-white/10 text-white shadow-[0_8px_32px_0_rgba(255,255,255,0.08)] min-h-[70vh]`}
                style={{
                    boxShadow: `0 0 25px -5px ${ACCENT_COLOR}40`, transition: 'box-shadow 1.2s ease-out'
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
                    accentColor={ACCENT_COLOR}
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
                            <ErrorBoundary fallback={modalErrorFallback}>
                                {currentStep === 'preview' && <PreviewStep />}
                                {currentStep === 'upload' && <UploadStep />}
                                {currentStep === 'processing' && <ProcessingStep />}
                                {currentStep === 'result' && <ResultStep />}
                            </ErrorBoundary>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
                <ModalFooter/>
            </motion.div>
        </motion.div>)}
    </AnimatePresence>);
}

export default function Modal(props: ModalProps) {
    return (
        <ErrorBoundary>
            <TryOnProvider productImage={props.productImage}>
                <ModalInner {...props} />
            </TryOnProvider>
        </ErrorBoundary>
    );
}
