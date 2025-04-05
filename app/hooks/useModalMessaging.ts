import { useEffect, useState } from 'react';

interface ModalMessage {
    type: 'openModal' | 'closeModal';
}

export const useModalMessaging = (onError?: (message: string) => void) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleMessage = async (event: MessageEvent): Promise<void> => {
            const data = event.data as ModalMessage;
            if (data?.type === 'openModal') {
                setIsModalOpen(true);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onError]);

    const closeModal = (): void => {
        setIsModalOpen(false);
        window.parent.postMessage(
            { type: 'closeModal' } as ModalMessage,
            '*'
        );
    };

    return { isModalOpen, closeModal };
};
