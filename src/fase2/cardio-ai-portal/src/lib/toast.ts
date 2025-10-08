// src/lib/toast.ts
import toast from 'react-hot-toast';
import { createElement } from 'react';

/**
 * Sistema de notificações customizado
 * Substitui o alert() padrão do navegador com toasts estilizados
 */

interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-right',
};

/**
 * Toast de sucesso - usado para confirmações e ações bem-sucedidas
 * @param message - Mensagem a ser exibida
 * @param options - Opções de configuração do toast
 */
export const showSuccess = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    duration: options?.duration || defaultOptions.duration,
    position: options?.position || defaultOptions.position,
    style: {
      background: '#10B981',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10B981',
    },
  });
};

/**
 * Toast de erro - usado para erros e falhas
 * @param message - Mensagem a ser exibida
 * @param options - Opções de configuração do toast
 */
export const showError = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    duration: options?.duration || defaultOptions.duration,
    position: options?.position || defaultOptions.position,
    style: {
      background: '#EF4444',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#EF4444',
    },
  });
};

/**
 * Toast de aviso - usado para alertas e avisos importantes
 * @param message - Mensagem a ser exibida
 * @param options - Opções de configuração do toast
 */
export const showWarning = (message: string, options?: ToastOptions) => {
  return toast(message, {
    duration: options?.duration || defaultOptions.duration,
    position: options?.position || defaultOptions.position,
    icon: '⚠️',
    style: {
      background: '#F59E0B',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
      fontWeight: '500',
    },
  });
};

/**
 * Toast de informação - usado para mensagens informativas
 * @param message - Mensagem a ser exibida
 * @param options - Opções de configuração do toast
 */
export const showInfo = (message: string, options?: ToastOptions) => {
  return toast(message, {
    duration: options?.duration || defaultOptions.duration,
    position: options?.position || defaultOptions.position,
    icon: 'ℹ️',
    style: {
      background: '#3B82F6',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
      fontWeight: '500',
    },
  });
};

/**
 * Toast de carregamento - usado para processos em andamento
 * @param message - Mensagem a ser exibida
 * @param options - Opções de configuração do toast
 */
export const showLoading = (message: string, options?: ToastOptions) => {
  return toast.loading(message, {
    position: options?.position || defaultOptions.position,
    style: {
      background: '#6B7280',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
      fontWeight: '500',
    },
  });
};

/**
 * Toast de confirmação - usado para solicitar confirmação do usuário
 * @param message - Mensagem a ser exibida
 * @param onConfirm - Callback executado ao confirmar
 * @param onCancel - Callback executado ao cancelar
 * @param options - Opções de configuração do toast
 */
export const showConfirm = async (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  options?: ToastOptions
) => {
  // Importar o componente dinamicamente
  const ConfirmToast = (await import('./toast-confirm')).default;
  
  return toast.custom(
    (t) =>
      createElement(ConfirmToast, {
        message,
        onConfirm,
        onCancel,
        toastId: t.id,
      }),
    {
      duration: Infinity,
      position: 'top-center',
      style: {
        background: 'transparent',
        boxShadow: 'none',
        padding: 0,
        margin: 0,
        width: '100vw',
        maxWidth: '100vw',
        height: '100vh',
        maxHeight: '100vh',
      },
    }
  );
};

/**
 * Atualiza um toast existente (útil para loading -> success/error)
 * @param toastId - ID do toast a ser atualizado
 * @param message - Nova mensagem
 * @param type - Tipo do toast (success, error, loading)
 */
export const updateToast = (
  toastId: string,
  message: string,
  type: 'success' | 'error' | 'loading'
) => {
  if (type === 'success') {
    toast.success(message, { id: toastId });
  } else if (type === 'error') {
    toast.error(message, { id: toastId });
  } else {
    toast.loading(message, { id: toastId });
  }
};

/**
 * Remove um toast específico
 * @param toastId - ID do toast a ser removido
 */
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

/**
 * Remove todos os toasts
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Exportar o toast padrão para casos de uso avançados
export { toast };
