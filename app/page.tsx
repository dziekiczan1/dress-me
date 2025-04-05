'use client'

import {useEffect, useState} from 'react';
import { Modal } from '@/app/components/modal';

export default function Home() {
    const [productImage, setProductImage] = useState<string | null>(null);
    const [containerSelector, setContainerSelector] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const param1 = urlParams.get('param1');

            if (param1) {
                setContainerSelector(param1);

                window.parent.postMessage({
                    type: 'getProductImage',
                    containerSelector: param1
                }, '*');

                const messageHandler = (event: MessageEvent) => {
                    if (event.data?.type === 'productImageData') {
                        setProductImage(event.data.imageSrc);
                    }
                };

                window.addEventListener('message', messageHandler);
                return () => window.removeEventListener('message', messageHandler);
            }
        }
    }, []);

    const openModal = () => {
        window.postMessage({
            type: 'openModal',
            param1: containerSelector
        }, '*');
    };

    useEffect(() => {
        if (containerSelector) {
            const timer = setTimeout(() => {
                openModal();
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [containerSelector]);


    return (
        <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black flex flex-col items-center justify-center">
            <div className="w-full max-w-lg mx-auto mb-12 space-y-8">
                <div className="w-full aspect-square bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center p-8 relative overflow-hidden">
                    <img
                        src={productImage!}
                        alt="Product"
                        className="max-h-full max-w-full object-contain"
                    />
                </div>
            </div>

            <Modal productImage={productImage!}/>
        </div>
    );
}
