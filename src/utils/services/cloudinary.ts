export function isCloudinaryConfigured(): boolean {
  const env = (import.meta as any).env || {};
  return Boolean(env.VITE_CLOUDINARY_CLOUD_NAME && env.VITE_CLOUDINARY_UPLOAD_PRESET);
}

export async function uploadPhotoToCloudinary(file: File): Promise<string> {
  const env = (import.meta as any).env || {};
  const cloudName = env.VITE_CLOUDINARY_CLOUD_NAME || '';
  const preset = env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
  if (!cloudName || !preset) return URL.createObjectURL(file);
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);
    const resp = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await resp.json();
    return data.secure_url;
  } catch {
    return URL.createObjectURL(file);
  }
}
