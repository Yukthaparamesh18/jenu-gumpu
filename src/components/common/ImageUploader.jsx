import React, { useRef, useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadImage } from '../../services/cloudinaryService';
import toast from 'react-hot-toast';

const ImageUploader = ({ onImagesChange, maxImages = 4, folder = "general" }) => {
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (previewUrls.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images.`);
      return;
    }

    setUploading(true);
    const toastId = toast.loading('Uploading images...');
    
    try {
      const newUrls = [];
      for (const file of files) {
        const url = await uploadImage(file, folder);
        newUrls.push(url);
      }
      
      const allUrls = [...previewUrls, ...newUrls];
      setPreviewUrls(allUrls);
      onImagesChange?.(allUrls);
      toast.success('Images uploaded successfully!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload images.', { id: toastId });
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    const newUrls = [...previewUrls];
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
    // Also notify parent to remove
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-2 mb-2">
        <AnimatePresence>
          {previewUrls.map((url, idx) => (
            <motion.div
              key={url}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square rounded-xl overflow-hidden border border-amber-200 dark:border-amber-900"
            >
              <img src={url} alt={`preview ${idx}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {previewUrls.length < maxImages && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 size={24} className="mb-1 animate-spin" />
            ) : (
              <UploadCloud size={24} className="mb-1" />
            )}
            <span className="text-[10px] font-medium">{uploading ? 'Uploading...' : 'Add Photo'}</span>
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Max {maxImages} images. First image will be the cover.
      </p>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
