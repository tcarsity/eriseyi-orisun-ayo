// src/utils/resizeImage.js
export const resizeImage = (
  file,
  maxWidth = 600,
  maxHeight = 600,
  quality = 0.8
) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    reader.onerror = reject;

    img.onload = () => {
      let { width, height } = img;

      // keep aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Resize failed");
          resolve(
            new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
          );
        },
        file.type,
        quality
      );
    };

    reader.readAsDataURL(file);
  });
};
