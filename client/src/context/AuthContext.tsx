'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ALL_ROLES, RoleDefinition, UserSession } from '@/types/auth';
import { userCredentialVault, VaultUser } from '@/lib/userCredentialVault';

interface AuthContextType {
  session: UserSession | null;
  activeRole: RoleDefinition;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    emailOrUsername: string,
    password: string,
    legacyRoleId?: string
  ) => Promise<{ success: boolean; error?: string; targetRoute?: string; user?: VaultUser }>;
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
          setSession({
            ...parsed,
            originalAdmin: parsed.originalAdmin ?? (parsed.roleId === 'super_admin'),
          });
        } else {
          setSession(null);
        }
      } else {
        // No active session in storage - user must authenticate on /login
        setSession(null);
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

  const login = async (
    arg1: string,
    arg2: string,
    arg3?: string
  ): Promise<{ success: boolean; error?: string; targetRoute?: string; user?: VaultUser }> => {
    let emailOrUser = arg1;
    let password = arg2;

    // Support legacy signature login(roleId, username, password)
    if (arg3 !== undefined) {
      emailOrUser = arg2;
      password = arg3;
    }

    // Authenticate against the tamper-proof user credential vault
    const authResult = userCredentialVault.authenticate(emailOrUser, password);
    if (!authResult.success || !authResult.user) {
      return { success: false, error: authResult.error || 'Authentication credentials could not be verified.' };
    }

    const vaultUser = authResult.user;
    const targetRole = ALL_ROLES.find((r) => r.id === vaultUser.roleId) || ALL_ROLES[0];
    const targetRoute = vaultUser.dashboardRoute || targetRole.dashboardRoute || `/dashboard/${targetRole.id}`;

    // Validated: Persist session
    const newSession: UserSession = {
      username: vaultUser.username,
      roleId: vaultUser.roleId,
      roleName: vaultUser.roleName,
      department: vaultUser.department,
      dashboardRoute: targetRoute,
      loginTimestamp: new Date().toISOString(),
      originalAdmin: vaultUser.roleId === 'super_admin',
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    } catch {
      // Fallback
    }

    setSession(newSession);
    return { success: true, targetRoute, user: vaultUser };
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
    // Multi-portal switching is strictly restricted to Top Admin!
    if (!session?.originalAdmin && session?.roleId !== 'super_admin') {
      console.warn('Unauthorized multi-portal switch attempt blocked: only Top Admin can switch portals.');
      return;
    }

    const targetRole = ALL_ROLES.find((r) => r.id === newRoleId);
    if (!targetRole) return;

    const updatedSession: UserSession = {
      username: targetRole.defaultUsername,
      roleId: targetRole.id,
      roleName: targetRole.name,
      department: targetRole.department,
      dashboardRoute: `/dashboard/${targetRole.id}`,
      loginTimestamp: new Date().toISOString(),
      originalAdmin: true,
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
