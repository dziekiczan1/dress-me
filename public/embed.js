(function() {
    const EMBED_CONFIG = {
        targetSelector: '[data-toggle="my-embed-button"]',
        embedDomain: 'http://localhost:3001'
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEmbed);
    } else {
        initEmbed();
    }

    function initEmbed() {
        const button = document.querySelector(EMBED_CONFIG.targetSelector);

        if (!button) {
            const retries = window._embedInitRetries || 0;
            if (retries < 10) {
                const delay = Math.min(100 * Math.pow(1.5, retries), 2000);
                window._embedInitRetries = retries + 1;
                setTimeout(initEmbed, delay);
            }
            return;
        }

        button.addEventListener('click', handleButtonClick);
    }

    function handleButtonClick() {
        const params = {
            imageContainer: window.IMAGE_CONTAINER || '',
        };

        const iframe = createIframe(params);
        setupMessageHandling(iframe);
        document.body.appendChild(iframe);
    }

    function createIframe(params) {
        const queryString = new URLSearchParams(params).toString();
        const iframe = document.createElement('iframe');

        iframe.src = `${EMBED_CONFIG.embedDomain}/?${queryString}`;
        iframe.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            border: none;
            z-index: 9999;
        `;

        iframe.addEventListener('load', () => {
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage(
                    {
                        type: 'openModal',
                        ...params
                    },
                    EMBED_CONFIG.embedDomain
                );
            }
        });

        return iframe;
    }

    function setupMessageHandling(iframe) {
        const messageHandler = (event) => {
            if (event.origin !== EMBED_CONFIG.embedDomain) return;

            const { data } = event;

            if (data?.type === 'closeModal') {
                iframe.remove();
                window.removeEventListener('message', messageHandler);
            }

            if (data?.type === 'getProductImage' && data.containerSelector) {
                handleProductImageRequest(data.containerSelector, iframe);
            }
        };

        window.addEventListener('message', messageHandler);
    }

    function handleProductImageRequest(containerSelector, iframe) {
        try {
            const container = document.querySelector(containerSelector);
            if (!container) {
                console.error('Product image container not found:', containerSelector);
                return;
            }

            const img = container.querySelector('img');
            if (!img || !img.src) {
                console.error('No image found in the specified container:', containerSelector);
                return;
            }

            iframe.contentWindow.postMessage(
                {
                    type: 'productImageData',
                    imageSrc: img.src
                },
                EMBED_CONFIG.embedDomain
            );
        } catch (err) {
            console.error('Error getting product image:', err);
        }
    }
})();
