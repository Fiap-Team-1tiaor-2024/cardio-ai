"use client";

/**
 * Client Layout Wrapper
 * Este componente envolve o conteúdo e adiciona providers que só funcionam no cliente
 */

import ToastProvider from "@/components/ToastProvider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ToastProvider />
      {children}
    </>
  );
}
