import React from "react";

interface ShellProps {
  children: React.ReactNode;
}

export const SkyBoundShell = ({ children }: ShellProps) => {
  return (
    <div className="min-h-screen w-full bg-[#f4f5f7] py-3 sm:py-6 md:py-8 lg:py-10 px-2 sm:px-4 md:px-6 lg:px-8 font-sans antialiased text-neutral-900">
      <div className="max-w-[1360px] mx-auto bg-white rounded-[30px] sm:rounded-[36px] md:rounded-[48px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-neutral-200/80 p-3.5 sm:p-6 md:p-8 lg:p-10 overflow-hidden">
        {children}
      </div>
    </div>
  );
};
