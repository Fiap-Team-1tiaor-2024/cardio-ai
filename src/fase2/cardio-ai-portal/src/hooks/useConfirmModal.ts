// src/hooks/useConfirmModal.ts
"use client";

import { useState, useCallback } from 'react';

interface ConfirmOptions {
  message: string;
  title?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function useConfirmModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    message: '',
    onConfirm: () => {},
  });

  const showConfirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const handleConfirm = useCallback(() => {
    options.onConfirm();
    setIsOpen(false);
  }, [options]);

  const handleCancel = useCallback(() => {
    if (options.onCancel) {
      options.onCancel();
    }
    setIsOpen(false);
  }, [options]);

  return {
    isOpen,
    message: options.message,
    title: options.title,
    showConfirm,
    handleConfirm,
    handleCancel,
  };
}
