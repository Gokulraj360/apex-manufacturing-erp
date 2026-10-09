'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ALL_ROLES, RoleDefinition, UserSession } from '@/types/auth';

interface AuthContextType {
  session: UserSession | null;
  activeRole: RoleDefinition;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (roleId: string, username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (roleId: string) => void;
}

const STORAGE_KEY = 'apex_erp_session_v1';

const DEFAULT_SUPER_ADMIN_ROLE = ALL_ROLES[0]; // super_admin

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage or default
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: UserSession = JSON.parse(stored);
        const matchedRole = ALL_ROLES.find((r) => r.id === parsed.roleId);
        if (matchedRole) {
          setSession(parsed);
        } else {
          // Fallback to default
          setSession({
            username: DEFAULT_SUPER_ADMIN_ROLE.defaultUsername,
            roleId: DEFAULT_SUPER_ADMIN_ROLE.id,
            roleName: DEFAULT_SUPER_ADMIN_ROLE.name,
            department: DEFAULT_SUPER_ADMIN_ROLE.department,
            dashboardRoute: DEFAULT_SUPER_ADMIN_ROLE.dashboardRoute,
            loginTimestamp: new Date().toISOString(),
          });
        }
      } else {
        // Create initial default super admin session so app is immediately usable
        const initialSession: UserSession = {
          username: DEFAULT_SUPER_ADMIN_ROLE.defaultUsername,
          roleId: DEFAULT_SUPER_ADMIN_ROLE.id,
          roleName: DEFAULT_SUPER_ADMIN_ROLE.name,
          department: DEFAULT_SUPER_ADMIN_ROLE.department,
          dashboardRoute: DEFAULT_SUPER_ADMIN_ROLE.dashboardRoute,
          loginTimestamp: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSession));
        setSession(initialSession);
      }
    } catch {
      // Local storage disabled or error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const activeRole = useMemo<RoleDefinition>(() => {
    if (!session) return DEFAULT_SUPER_ADMIN_ROLE;
    const found = ALL_ROLES.find((r) => r.id === session.roleId);
    return found || DEFAULT_SUPER_ADMIN_ROLE;
  }, [session]);

  const login = async (roleId: string, username: string, password: string) => {
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    const targetRole = ALL_ROLES.find((r) => r.id === roleId);
    if (!targetRole) {
      return { success: false, error: 'Invalid role selection.' };
    }

    if (!trimmedUser) {
      return { success: false, error: 'Please enter a valid Username or Employee ID.' };
    }

    // Role-Specific Validation Rules
    if (roleId === 'super_admin') {
      if (trimmedUser !== 'super_admin' || trimmedPass !== '123') {
        return {
          success: false,
          error: 'Super Admin authentication failed. Expected username: "super_admin" and password: "123".',
        };
      }
    } else {
      if (trimmedPass !== '1234') {
        return {
          success: false,
          error: `Invalid credentials for ${targetRole.name}. Expected password is "1234".`,
        };
      }
    }

    // Validated: Persist session
    const newSession: UserSession = {
      username: trimmedUser,
      roleId: targetRole.id,
      roleName: targetRole.name,
      department: targetRole.department,
      dashboardRoute: `/dashboard/${targetRole.id}`,
      loginTimestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    } catch {
      // Fallback
    }

    setSession(newSession);
    return { success: true };
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Fallback
    }
    setSession(null);
    router.push('/login');
  };

  const switchRole = (newRoleId: string) => {
    const targetRole = ALL_ROLES.find((r) => r.id === newRoleId);
    if (!targetRole) return;

    const updatedSession: UserSession = {
      username: targetRole.defaultUsername,
      roleId: targetRole.id,
      roleName: targetRole.name,
      department: targetRole.department,
      dashboardRoute: `/dashboard/${targetRole.id}`,
      loginTimestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
    } catch {
      // Fallback
    }

    setSession(updatedSession);
    router.push(`/dashboard/${targetRole.id}`);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        activeRole,
        isAuthenticated: !!session,
        isLoading,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
