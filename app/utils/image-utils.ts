export const optimizeImage = async (file: File, maxWidth = 1024, maxHeight = 1024): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Calculate the new dimensions while maintaining aspect ratio
            if (width > height && width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            } else if (height > maxHeight) {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);

            // Get the data URL representing the canvas
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            resolve(dataUrl);
        };

        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
};

export const resizeImage = (dataUrl: string, minWidth: number, minHeight: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            // Check if resizing is actually needed
            if (img.width >= minWidth && img.height >= minHeight) {
                resolve(dataUrl); // Return original if already big enough
                return;
            }

            // Calculate dimensions while preserving aspect ratio
            const aspectRatio = img.width / img.height;

            let newWidth = minWidth;
            let newHeight = Math.round(newWidth / aspectRatio);

            // If height is still too small, set height to minimum and recalculate width
            if (newHeight < minHeight) {
                newHeight = minHeight;
                newWidth = Math.round(newHeight * aspectRatio);
            }

            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;

            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, newWidth, newHeight);

            // Return as data URL, using the same format as the input
            const mimeType = dataUrl.split(';')[0].split(':')[1];
            resolve(canvas.toDataURL(mimeType, 0.9));
        };
        img.onerror = () => reject(new Error('Failed to load image for resizing'));
        img.src = dataUrl;
    });
};
