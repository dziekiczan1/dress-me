(function() {
    const config = {
        targetSelector: '[data-toggle="my-embed-button"]',
        iframeBaseUrl: 'http://localhost:3001/',
        messageOrigin: 'http://localhost:3001'
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEmbed);
    } else {
        initEmbed();
    }

    function initEmbed() {
        const button = document.querySelector(config.targetSelector);
        if (!button) {
            const retries = window._embedInitRetries || 0;
            const delay = Math.min(100 * (retries + 1), 2000);
            setTimeout(initEmbed, delay);
            window._embedInitRetries = retries + 1;
            return;
        }

        button.addEventListener('click', createIframe);
    }

    function createIframe() {
        const params = {
            param1: window.MY_EMBED_PARAM1 || '',
        };

        const iframe = document.createElement('iframe');
        const queryString = Object.entries(params)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        iframe.src = `${config.iframeBaseUrl}?${queryString}`;
        iframe.id = 'my-embed-iframe';
        iframe.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            border: none;
            z-index: 9999;
        `;

        const messageHandler = (event) => {
            if (event.origin !== config.messageOrigin) return;

            // Handle close modal message
            if (event.data?.type === 'closeModal') {
                iframe.remove();
                window.removeEventListener('message', messageHandler);
            }

            // Handle request for product image
            if (event.data?.type === 'getProductImage') {
                const containerSelector = event.data.containerSelector;
                if (containerSelector) {
                    try {
                        // Try to find the container and image
                        const container = document.querySelector(containerSelector);
                        if (container) {
                            const img = container.querySelector('img');
                            if (img && img.src) {
                                // Send the image source back to the iframe
                                iframe.contentWindow.postMessage(
                                    {
                                        type: 'productImageData',
                                        imageSrc: img.src
                                    },
                                    config.messageOrigin
                                );
                            } else {
                                console.error('No image found in the specified container:', containerSelector);
                            }
                        } else {
                            console.error('Product image container not found:', containerSelector);
                        }
                    } catch (err) {
                        console.error('Error getting product image:', err);
                    }
                }
            }
        };

        window.addEventListener('message', messageHandler);

        iframe.addEventListener('load', () => {
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage(
                    {
                        type: 'openModal',
                        ...params
                    },
                    config.messageOrigin
                );
            }
        });

        document.body.appendChild(iframe);
    }
})();
