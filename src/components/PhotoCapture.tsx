import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { uploadPhotoToCloudinary, isCloudinaryConfigured } from '../utils/services';

type Props = {
  label?: string;
  value?: string;
  onChange: (url: string | undefined) => void;
  className?: string;
};

export function PhotoCapture({ label = 'Photo', value, onChange, className = '' }: Props) {
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setLoading(true);
    try {
      if (isCloudinaryConfigured()) {
        try {
          const cloudUrl = await uploadPhotoToCloudinary(file);
          if (cloudUrl && cloudUrl.startsWith('blob:')) {
            const dataUrl = await compressImage(file, 800, 0.7);
            onChange(dataUrl);
          } else {
            onChange(cloudUrl);
          }
        } catch {
          const dataUrl = await compressImage(file, 800, 0.7);
          onChange(dataUrl);
        }
      } else {
        const dataUrl = await compressImage(file, 800, 0.7);
        onChange(dataUrl);
      }
    } catch {
      alert('Failed to process image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200">
          <img src={value} alt="Preview" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50">
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-slate-500">Processing photo...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => cameraRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    <Camera className="w-4 h-4" />
                    Take Photo
                  </button>
                </div>
                <p className="text-xs text-slate-400">JPG, PNG up to 5MB</p>
              </div>
            </>
          )}
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
    </div>
  );
}

function compressImage(file: File, maxSize: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas error'));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
