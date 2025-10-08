// src/lib/toast-confirm.tsx
"use client";

import toast from 'react-hot-toast';
import { useEffect } from 'react';

interface ConfirmToastProps {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  toastId: string;
}

function ConfirmToast({ message, onConfirm, onCancel, toastId }: ConfirmToastProps) {
  const handleConfirm = () => {
    onConfirm();
    toast.dismiss(toastId);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    toast.dismiss(toastId);
  };

  // Bloquear scroll quando o modal estiver aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Overlay com blur */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
        onClick={handleCancel}
      />
      
      {/* Modal centralizado */}
      <div 
        style={{
          position: 'relative',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          padding: '24px',
          width: '100%',
          maxWidth: '448px',
          margin: '0 16px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mensagem */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#111827',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            Confirmação
          </h3>
          <p style={{ 
            color: '#374151',
            textAlign: 'center',
            lineHeight: '1.5'
          }}>
            {message}
          </p>
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleCancel}
            style={{
              flex: 1,
              padding: '10px 16px',
              backgroundColor: '#E5E7EB',
              color: '#1F2937',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D1D5DB'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            style={{
              flex: 1,
              padding: '10px 16px',
              backgroundColor: '#2563EB',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmToast;
