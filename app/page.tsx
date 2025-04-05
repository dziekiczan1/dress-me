'use client'

import {useEffect, useState} from 'react';
import { Modal } from '@/app/components/modal';
import Image from 'next/image';

export default function Home() {
    const [productImage, setProductImage] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const imageContainerSelector = urlParams.get('imageContainer');
            if (imageContainerSelector) {
                window.parent.postMessage({
                    type: 'getProductImage',
                    containerSelector: imageContainerSelector
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

    return (
        <div className="p-8 min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center">
            <div className="w-full max-w-lg mx-auto mb-12 space-y-8">
                <div className="w-full aspect-square bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center p-8 relative overflow-hidden">
                    {productImage && (
                    <Image
                        src={productImage}
                        alt="Product"
                        fill
                        className="object-contain p-4"
                    />
                )}
                </div>
            </div>
            <div className={`absolute inset-0 bg-black/30 backdrop-blur-md`}></div>

            <Modal productImage={productImage!}/>
        </div>
    );
}
