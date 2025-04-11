'use client'

import {useEffect, useState} from 'react';
import { Modal } from '@/app/components/modal';
import Image from 'next/image';
import ErrorBoundary from '@/app/components/common/error-boundary';

export default function Home() {
    const [productImage, setProductImage] = useState<string | null>(null);
    const [originalProductImage, setOriginalProductImage] = useState<string | null>(null);

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
                        setOriginalProductImage(event.data.imageSrc);
                    }
                };

                window.addEventListener('message', messageHandler);
                return () => window.removeEventListener('message', messageHandler);
            }
        }
    }, []);

    const errorFallback = (
        <div className="p-8 min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center">
            <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-6 max-w-md text-center">
                <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
                <p className="text-red-200 mb-4">
                    We couldn't load the virtual try-on experience. Please refresh the page or try again later.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-white text-red-900 rounded-md hover:bg-red-100 transition-colors"
                >
                    Refresh Page
                </button>
            </div>
        </div>
    );

    return (
        <ErrorBoundary fallback={errorFallback}>
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

                {/* Pass the original image URL to the Modal */}
                <Modal productImage={originalProductImage!}/>
            </div>
        </ErrorBoundary>
    );
}
