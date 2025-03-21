"use client";
import { isClient } from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";
import { ProjectType } from "@/schemaValidations/project.schema";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type User = AccountResType["data"];

const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  project: ProjectType | null;
  setProject: (project: ProjectType | null) => void;
}>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  project: null,
  setProject: () => {},
});

export const useAppContext = () => useContext(AppContext);

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUserState] = useState<User | null>(() => {
    if (isClient()) {
      const _user = localStorage.getItem("user");
      return _user ? JSON.parse(_user) : null;
    }
    return null;
  });

  const [project, setProjectState] = useState<ProjectType | null>(() => {
    if (isClient()) {
      const _project = localStorage.getItem("project");
      return _project ? JSON.parse(_project) : null;
    }
    return null;
  });

  const setProject = useCallback((project: ProjectType | null) => {
    setProjectState(project);
    if (project) {
      localStorage.setItem("project", JSON.stringify(project));
    } else {
      localStorage.removeItem("project");
    }
  }, []);

  const isAuthenticated = Boolean(user);

  const setUser = useCallback((user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, []);

  useEffect(() => {
    if (isClient()) {
      const _user = localStorage.getItem("user");
      setUserState(_user ? JSON.parse(_user) : null);
      const _project = localStorage.getItem("project");
      setProjectState(_project ? JSON.parse(_project) : null);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{ user, setUser, isAuthenticated, project, setProject }}
    >
      {children}
    </AppContext.Provider>
  );
}
 