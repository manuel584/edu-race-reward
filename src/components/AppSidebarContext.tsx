
import React, { createContext, useContext, useState } from "react";

interface AppSidebarContextType {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppSidebarContext = createContext<AppSidebarContextType | undefined>(undefined);

export function AppSidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AppSidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </AppSidebarContext.Provider>
  );
}

export function useAppSidebar() {
  const context = useContext(AppSidebarContext);
  if (!context) {
    throw new Error("useAppSidebar must be used within an AppSidebarProvider");
  }
  return context;
}
