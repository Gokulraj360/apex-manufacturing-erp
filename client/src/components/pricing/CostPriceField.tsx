'use client';

import React, { useState } from 'react';
import { Lock, Unlock, EyeOff, ShieldAlert, Sparkles } from 'lucide-react';
import { PriceAccessBadge } from './PriceAccessBadge';
import { PricingOverrideModal } from './PricingOverrideModal';
import { SYSTEM_ROLE_MATRIX } from '@/hooks/usePricingPermission';

interface CostPriceFieldProps {
  value: number;
  onChange?: (val: number) => void;
  role?: string;
  label?: string;
  currency?: string;
  itemSku?: string;
  itemName?: string;
  targetEntity?: string;
  entityId?: string;
  className?: string;
  showBadge?: boolean;
}

export function CostPriceField({
  value,
  onChange,
  role = 'PROCUREMENT_OFFICER',
  label = 'Raw Material Rate (Cost Price)',
  currency = '₹',
  itemSku = 'RAW-MAT-GENERIC',
  itemName,
  targetEntity = 'MaterialCatalog',
  entityId = 'entity-01',
  className = '',
  showBadge = true,
}: CostPriceFieldProps) {
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  const normalizedRole = role.toUpperCase().replace(/\s+/g, '_');
  const roleConfig = SYSTEM_ROLE_MATRIX[normalizedRole]?.costPrice || {
    canView: false,
    canEdit: false,
  };

  const { canView, canEdit } = roleConfig;

  // Case 1: Restricted - Role cannot even view Raw Material Cost
  if (!canView) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        {label && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">{label}</span>
            {showBadge && <PriceAccessBadge status="RESTRICTED" role={normalizedRole} />}
          </div>
        )}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-500 font-mono text-xs select-none">
          <div className="flex items-center gap-2">
            <EyeOff className="h-3.5 w-3.5 text-rose-400/80" />
            <span className="tracking-widest">••••••••••</span>
          </div>
          <span className="text-[10px] text-slate-600 italic">Hidden (Confidential)</span>
        </div>
      </div>
    );
  }

  // Case 2: Read-Only View - Role can view, but cannot edit (Design, Production, Warehouse)
  if (!canEdit) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        {label && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">{label}</span>
            {showBadge && <PriceAccessBadge status="VIEW_ONLY" role={normalizedRole} />}
          </div>
        )}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border border-blue-500/20 rounded-lg text-slate-200 font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-blue-400" />
            <span className="font-semibold text-slate-100">
              {currency}{value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowOverrideModal(true)}
            className="text-[10px] text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1"
            title="Request Super Admin price override"
          >
            <ShieldAlert className="h-3 w-3" />
            Request Override
          </button>
        </div>

        <PricingOverrideModal
          isOpen={showOverrideModal}
          onClose={() => setShowOverrideModal(false)}
          targetEntity={targetEntity}
          entityId={entityId}
          itemSku={itemSku}
          itemName={itemName}
          priceType="RAW_MATERIAL_COST"
          currentPrice={value}
          requesterRole={normalizedRole}
        />
      </div>
    );
  }

  // Case 3: Edit Authorized - Procurement, Finance, Super Admin
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium">{label}</span>
          {showBadge && <PriceAccessBadge status="EDIT_ALLOWED" role={normalizedRole} />}
        </div>
      )}
      <div className="relative flex items-center">
        <span className="absolute left-3 text-emerald-400 font-bold text-xs select-none">
          {currency}
        </span>
        <input
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => onChange && onChange(Number(e.target.value) || 0)}
          className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 focus:border-emerald-500 rounded-lg pl-7 pr-3 py-2 text-xs font-mono font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
        />
      </div>
    </div>
  );
}
