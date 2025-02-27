"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface ProjectContextType {
  projectId: string | null;
  setProjectId: (id: string | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined
);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    const segments = pathname.split("/");
    const idFromUrl = segments.length > 2 ? segments[2] : null;
    setProjectId(idFromUrl);
  }, [pathname]);

  return (
    <ProjectContext.Provider value={{ projectId, setProjectId }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
