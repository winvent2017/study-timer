"use client";

import { ReactNode } from "react";

export default function Modal({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#4a3728]/40 p-4">
      <div className="animate-modal-pop w-full max-w-sm rounded-3xl bg-[var(--background)] p-6 text-center shadow-xl">
        {children}
      </div>
    </div>
  );
}
