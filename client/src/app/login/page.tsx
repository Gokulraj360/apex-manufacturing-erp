'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { userCredentialVault } from '@/lib/userCredentialVault';
import { LoginPage1 } from '@/components/ui/login-page-1';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>('owner@apexcorp.com');
  const [password, setPassword] = useState<string>('123');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success && result.targetRoute) {
        router.push(result.targetRoute);
      } else {
        setErrorMessage(
          result.error ||
            'Authentication failed. Please check your corporate email and password.'
        );
      }
    } catch {
      setErrorMessage(
        'An unexpected authentication error occurred. Please verify your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemoUser = (user: { email: string; passwordHash: string }) => {
    setEmail(user.email);
    setPassword(user.passwordHash);
    setErrorMessage('');
  };

  const allVaultUsers = userCredentialVault.getAllUsers();

  return (
    <LoginPage1
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      rememberMe={rememberMe}
      setRememberMe={setRememberMe}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      errorMessage={errorMessage}
      demoUsers={allVaultUsers}
      onSelectDemoUser={handleSelectDemoUser}
    />
  );
}
