'use client';

import React from 'react';
import { Lock, Unlock, EyeOff, ShieldCheck, AlertTriangle } from 'lucide-react';

export type AccessStatus = 'EDIT_ALLOWED' | 'VIEW_ONLY' | 'RESTRICTED' | 'OVERRIDE_NEEDED';

interface PriceAccessBadgeProps {
  status: AccessStatus;
  role?: string;
  size?: 'sm' | 'md';
}

export function PriceAccessBadge({
  status,
  role,
  size = 'sm',
}: PriceAccessBadgeProps) {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  if (status === 'EDIT_ALLOWED') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${sizeClasses}`}
        title={`Edit authorization granted for role: ${role || 'Current'}`}
      >
        <Unlock className="h-3 w-3" />
        Edit Access
      </span>
    );
  }

  if (status === 'VIEW_ONLY') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 ${sizeClasses}`}
        title={`View-only permission (Edits restricted to Procurement/Finance)`}
      >
        <Lock className="h-3 w-3" />
        Read-Only
      </span>
    );
  }

  if (status === 'OVERRIDE_NEEDED') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 ${sizeClasses}`}
        title="Price change exceeds allowed discount threshold. Super Admin override required."
      >
        <AlertTriangle className="h-3 w-3" />
        Override Required
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 ${sizeClasses}`}
      title="Field-level RBAC: Access to this pricing tier is restricted for this role."
    >
      <EyeOff className="h-3 w-3" />
      Confidential
    </span>
  );
}
