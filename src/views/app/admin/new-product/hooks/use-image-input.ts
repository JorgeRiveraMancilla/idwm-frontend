"use client";

import { useEffect, useState } from "react";

type UseImageInputParams = {
  value: File[];
  onChange: (files: File[]) => void;
  onBlur?: () => void;
};

export function useImageInput({
  value,
  onChange,
  onBlur,
}: UseImageInputParams) {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const validFiles = value.filter(file => file instanceof File);
    const urls = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(urls);

    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [value]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    if (files.length === 0) {
      onBlur?.();
      return;
    }

    onChange([...value, ...Array.from(files)]);
    onBlur?.();
  };

  const removeImage = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
    onBlur?.();
  };

  const removeAll = () => {
    onChange([]);
    onBlur?.();
  };

  return {
    previews,
    handleFiles,
    removeImage,
    removeAll,
  };
}
