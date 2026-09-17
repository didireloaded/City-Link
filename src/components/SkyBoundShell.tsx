import React from "react";

interface ShellProps {
  children: React.ReactNode;
}

export const SkyBoundShell = ({ children }: ShellProps) => {
  return (
    <div className="min-h-screen w-full bg-white font-sans antialiased text-neutral-900">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-0">
        {children}
      </div>
    </div>
  );
};
