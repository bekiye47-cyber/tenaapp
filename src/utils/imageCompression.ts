/**
 * Client-side receipt image compression and resizing utility.
 * Optimizes photos to max 1200px dimension and converts to efficient JPEG at 0.82 quality,
 * reducing phone camera 10MB+ images down to <400KB with crystal clear readability.
 */
export async function compressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<{ dataUrl: string; blob: Blob; sizeKb: number }> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please select an image file (PNG, JPG, or WEBP).'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for processing.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error('Could not initialize canvas context.'));
        }

        // Fill white background in case of transparent PNGs
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Image compression failed.'));
            }
            const sizeKb = Math.round(blob.size / 1024);
            resolve({ dataUrl, blob, sizeKb });
          },
          'image/jpeg',
          quality
        );
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
