'use client';

import React, { useState } from 'react';
import { Lock, Unlock, EyeOff, ShieldAlert, AlertTriangle } from 'lucide-react';
import { PriceAccessBadge } from './PriceAccessBadge';
import { PricingOverrideModal } from './PricingOverrideModal';
import { SYSTEM_ROLE_MATRIX } from '@/hooks/usePricingPermission';

interface SellingPriceFieldProps {
  value: number;
  onChange?: (val: number) => void;
  role?: string;
  label?: string;
  currency?: string;
  standardPrice?: number;
  itemSku?: string;
  itemName?: string;
  targetEntity?: string;
  entityId?: string;
  className?: string;
  showBadge?: boolean;
}

export function SellingPriceField({
  value,
  onChange,
  role = 'CRM_SALES_REP',
  label = 'Selling Price (Product Pricing)',
  currency = '₹',
  standardPrice,
  itemSku = 'PROD-SKU-GENERIC',
  itemName,
  targetEntity = 'Quotation',
  entityId = 'quotation-01',
  className = '',
  showBadge = true,
}: SellingPriceFieldProps) {
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  const normalizedRole = role.toUpperCase().replace(/\s+/g, '_');
  const roleConfig = SYSTEM_ROLE_MATRIX[normalizedRole]?.sellingPrice || {
    canView: false,
    canEdit: false,
  };

  const { canView, canEdit, maxDiscountPct } = roleConfig;

  // Compute discount percentage if standard reference price is provided
  const basePrice = standardPrice || value;
  const currentDiscountPct =
    basePrice > 0 && value < basePrice
      ? Number((((basePrice - value) / basePrice) * 100).toFixed(1))
      : 0;

  const isExceedingDiscount =
    canEdit &&
    maxDiscountPct != null &&
    currentDiscountPct > maxDiscountPct;

  // Case 1: Restricted - Role cannot view Selling Price (Design, Production, Workers)
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
          <span className="text-[10px] text-slate-600 italic">Commercial Restricted</span>
        </div>
      </div>
    );
  }

  // Case 2: Read-Only View - Marketing, Dispatch, Warehouse
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
          <span className="text-[10px] text-slate-500 font-sans">Published Catalog Rate</span>
        </div>
      </div>
    );
  }

  // Case 3: Edit Authorized - Super Admin, CRM / Sales (within discount cap), Finance
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium">{label}</span>
          {showBadge && (
            <PriceAccessBadge
              status={isExceedingDiscount ? 'OVERRIDE_NEEDED' : 'EDIT_ALLOWED'}
              role={normalizedRole}
            />
          )}
        </div>
      )}

      <div className="space-y-1">
        <div className="relative flex items-center">
          <span className="absolute left-3 text-emerald-400 font-bold text-xs select-none">
            {currency}
          </span>
          <input
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => onChange && onChange(Number(e.target.value) || 0)}
            className={`w-full bg-slate-950 border rounded-lg pl-7 pr-3 py-2 text-xs font-mono font-semibold text-white focus:outline-none focus:ring-1 transition-all ${
              isExceedingDiscount
                ? 'border-amber-500/80 focus:border-amber-500 focus:ring-amber-500/50'
                : 'border-slate-700 hover:border-slate-600 focus:border-emerald-500 focus:ring-emerald-500/50'
            }`}
          />
        </div>

        {/* Discount Policy Alert */}
        {isExceedingDiscount && (
          <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-[11px] text-amber-300">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>
                Discount ({currentDiscountPct}%) exceeds role cap of {maxDiscountPct}%.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowOverrideModal(true)}
              className="text-[10px] font-semibold bg-amber-500 text-slate-950 px-2 py-0.5 rounded hover:bg-amber-400 transition-colors ml-2"
            >
              Request Override
            </button>
          </div>
        )}
      </div>

      <PricingOverrideModal
        isOpen={showOverrideModal}
        onClose={() => setShowOverrideModal(false)}
        targetEntity={targetEntity}
        entityId={entityId}
        itemSku={itemSku}
        itemName={itemName}
        priceType="PRODUCT_SELLING_PRICE"
        currentPrice={basePrice}
        initialRequestedPrice={value}
        requesterRole={normalizedRole}
      />
    </div>
  );
}
