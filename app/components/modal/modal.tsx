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
                            {currentStep === 'preview' && <PreviewStep />}
                            {currentStep === 'upload' && <UploadStep />}
                            {currentStep === 'processing' && <ProcessingStep />}
                            {currentStep === 'result' && <ResultStep />}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
                <ModalFooter/>
            </motion.div>
        </motion.div>)}
    </AnimatePresence>);
}

export default function Modal(props: ModalProps) {
    return (<TryOnProvider productImage={props.productImage}>
        <ModalInner {...props} />
    </TryOnProvider>);
}
