// Minimal Providers wrapper for app-wide contexts.
// Extend this later with QueryClientProvider, ThemeProvider, etc. if needed.

import React from "react";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <>{children}</>;
}


