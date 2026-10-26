'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building2,
  Send,
  FileCheck2,
  DollarSign,
  UserCheck,
  Sparkles,
  X,
  Check,
  Truck,
  Package,
  Layers,
  Cpu,
  KeyRound,
  FileText,
} from 'lucide-react';
import { normalizeRoleId } from '@/config/roleNavigation';

export interface ActionAlertItem {
  id: string;
  roleId: string;
  badge: string;
  badgeColor: 'amber' | 'blue' | 'emerald' | 'purple' | 'rose';
  title: string;
  description: string;
  submittedBy?: string;
  timestamp: string;
  primaryActionLabel: string;
  primaryActionType: 'modal_finance_payout' | 'modal_super_admin_wage' | 'link';
  primaryActionHref?: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  status: 'PENDING' | 'RESOLVED';
  resolvedNote?: string;
}

const DEFAULT_ALERTS: ActionAlertItem[] = [
  // Finance Role Alerts
  {
    id: 'alert-fin-1',
    roleId: 'finance',
    badge: 'PENDING FINANCIAL SETTLEMENT',
    badgeColor: 'amber',
    title: 'Pending Payout Verification from HR & Assembly Managers',
    description: 'Line 1 Circuit Board Manager & HR submitted October 2026 Shift Factory Payroll (144 Technicians · ₹33,21,600 net) awaiting statutory PF/ESI verification and corporate bank release.',
    submittedBy: 'Kavita Menon (HR Lead) & Suresh Raina (Line 1 Mgr)',
    timestamp: 'Today, 10:15 AM',
    primaryActionLabel: 'Review & Release Payout',
    primaryActionType: 'modal_finance_payout',
    secondaryActionLabel: 'Open Full Payroll Desk',
    secondaryActionHref: '/payroll',
    status: 'PENDING',
  },
  {
    id: 'alert-fin-2',
    roleId: 'finance',
    badge: 'ACCOUNTS PAYABLE MATCH',
    badgeColor: 'blue',
    title: 'Inbound Supplier Bills Awaiting 3-Way GRN Match',
    description: '2 raw material invoices from Semiconductor Core Technologies (PO-9042) and Sony Sensors matched against warehouse receiving slips.',
    submittedBy: 'Procurement & Warehouse Dock',
    timestamp: 'Today, 08:30 AM',
    primaryActionLabel: 'Inspect Bills & Match GRN',
    primaryActionType: 'link',
    primaryActionHref: '/finance/vendor-bills',
    status: 'PENDING',
  },

  // Super Admin / Owner Alerts
  {
    id: 'alert-super-1',
    roleId: 'super_admin',
    badge: 'EXECUTIVE CLEARANCE REQUIRED',
    badgeColor: 'purple',
    title: 'Department Wage Allocation & Overtime Sign-Off',
    description: 'Line 1 Circuit Board Assembly Manager submitted shift overtime authorization (14 hrs night sprint) for Precision Controller & Motherboard Production.',
    submittedBy: 'Suresh Raina (Line 1 Production Manager)',
    timestamp: 'Today, 09:45 AM',
    primaryActionLabel: 'Authorize Department Wage Sheet',
    primaryActionType: 'modal_super_admin_wage',
    secondaryActionLabel: 'Open Department Payroll Desk',
    secondaryActionHref: '/department-payroll',
    status: 'PENDING',
  },
  {
    id: 'alert-super-2',
    roleId: 'super_admin',
    badge: 'HIGH-VALUE PURCHASE ORDER',
    badgeColor: 'amber',
    title: 'High-Value PO Sign-Off: Precision Industrial Microprocessors',
    description: 'PO-9042 for 10,000 chipset modules totaling ₹1,45,00,000 awaiting final MD signature.',
    submittedBy: 'Sourcing & Supply Chain Team',
    timestamp: 'Yesterday, 04:30 PM',
    primaryActionLabel: 'Inspect & Authorize PO',
    primaryActionType: 'link',
    primaryActionHref: '/pricing-control',
    status: 'PENDING',
  },

  // HR Role Alerts
  {
    id: 'alert-hr-1',
    roleId: 'hr',
    badge: 'WORKFORCE LEAVE APPROVALS',
    badgeColor: 'amber',
    title: 'Pending Leave Approvals from Shift Technicians',
    description: '3 casual and medical leave requests submitted by Precision Assembly Line 2 technicians awaiting HR department approval.',
    submittedBy: 'Precision Assembly Department',
    timestamp: 'Today, 08:15 AM',
    primaryActionLabel: 'Review & Approve Leave',
    primaryActionType: 'link',
    primaryActionHref: '/leave',
    status: 'PENDING',
  },

  // Warehouse Role Alerts
  {
    id: 'alert-wh-1',
    roleId: 'warehouse',
    badge: 'INBOUND RECEIVING DOCK',
    badgeColor: 'blue',
    title: 'Incoming Parts Shipment Docked at Gate Security',
    description: 'Container Truck KA-04-E-8891 carrying 10,000 industrial display modules docked at Inbound Gate 02 awaiting warehouse barcode scan & GRN.',
    submittedBy: 'Logistics Gate Security',
    timestamp: 'Today, 09:00 AM',
    primaryActionLabel: 'Create Inbound Goods Receipt Note (GRN)',
    primaryActionType: 'link',
    primaryActionHref: '/logistics-gate',
    status: 'PENDING',
  },

  // Production Role Alerts
  {
    id: 'alert-prod-1',
    roleId: 'production',
    badge: 'MONTHLY WAGE SHEET DUE',
    badgeColor: 'amber',
    title: 'Compile & Submit Department Attendance to HR & Finance',
    description: 'October 2026 shift attendance and overtime hours compiled. Ready for submission to HR, Finance, and Super Admin review.',
    submittedBy: 'Shift Turnstile Biometric Gateway',
    timestamp: 'Today, 07:00 AM',
    primaryActionLabel: 'Submit Department Payout Sheet',
    primaryActionType: 'link',
    primaryActionHref: '/department-payroll',
    status: 'PENDING',
  },

  // Quality Role Alerts
  {
    id: 'alert-qa-1',
    roleId: 'quality',
    badge: 'PRE-DISPATCH QUALITY AUDIT',
    badgeColor: 'emerald',
    title: 'Line 5 Thermal Aging & Durability Certification Due',
    description: 'Batch 5G-902 finished units (500 units) awaiting final quality compliance stamps before packaging.',
    submittedBy: 'Assembly Line 5',
    timestamp: 'Today, 10:00 AM',
    primaryActionLabel: 'Conduct Final Quality Check',
    primaryActionType: 'link',
    primaryActionHref: '/quality',
    status: 'PENDING',
  },

  // Fleet Role Alerts
  {
    id: 'alert-fleet-1',
    roleId: 'fleet',
    badge: 'TRIP DISPATCH READY',
    badgeColor: 'blue',
    title: 'Consignment Gate Pass Cleared for Transit',
    description: 'Vehicle TRK-04 (Tata Ultra 1918) loaded with 2,500 finished product units cleared by Gate Security for regional distribution hub.',
    submittedBy: 'Dispatch Dock & Gate Security',
    timestamp: 'Today, 11:00 AM',
    primaryActionLabel: 'Start Trip & Live Vehicle Tracker',
    primaryActionType: 'link',
    primaryActionHref: '/fleet',
    status: 'PENDING',
  },

  // Procurement Role Alerts
  {
    id: 'alert-proc-1',
    roleId: 'procurement',
    badge: 'SUPPLIER QUOTATIONS RECEIVED',
    badgeColor: 'purple',
    title: 'New Price Quotes Received for FPC Connectors',
    description: '3 suppliers submitted competitive bids for flexible printed circuit connectors. Evaluation recommended.',
    submittedBy: 'Supplier Portal Gateway',
    timestamp: 'Today, 09:20 AM',
    primaryActionLabel: 'Compare Quotes & Select Vendor',
    primaryActionType: 'link',
    primaryActionHref: '/procurement/rfqs',
    status: 'PENDING',
  },

  // System Admin Alerts
  {
    id: 'alert-sys-1',
    roleId: 'system_admin',
    badge: 'NEW EMPLOYEE CREDENTIALS',
    badgeColor: 'blue',
    title: 'New Assembly Technicians Awaiting Login Credentials',
    description: '2 newly hired SMT Line operators approved by HR awaiting username generation and factory security clearance.',
    submittedBy: 'HR Onboarding Desk',
    timestamp: 'Today, 08:45 AM',
    primaryActionLabel: 'Issue User Credentials',
    primaryActionType: 'link',
    primaryActionHref: '/credentials',
    status: 'PENDING',
  },
];

export function RoleActionAlerts({ roleId }: { roleId?: string }) {
  const normalized = normalizeRoleId(roleId);
  const [alerts, setAlerts] = useState<ActionAlertItem[]>(DEFAULT_ALERTS);

  // Active Modals state
  const [activeFinanceModal, setActiveFinanceModal] = useState<ActionAlertItem | null>(null);
  const [activeSuperWageModal, setActiveSuperWageModal] = useState<ActionAlertItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalSuccessMessage, setModalSuccessMessage] = useState('');

  // Filter alerts specifically for this active role
  const roleAlerts = alerts.filter((a) => {
    if (normalized === 'super_admin') return a.roleId === 'super_admin' || a.badgeColor === 'amber';
    return a.roleId === normalized;
  });

  if (roleAlerts.length === 0) {
    return null;
  }

  // Handle Finance Payout Clearance right from in-dashboard card
  const handleConfirmFinanceRelease = (alertId: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId
            ? {
                ...a,
                status: 'RESOLVED',
                resolvedNote: 'Statutory records verified. Cleared via HDFC-CORP-RTGS-9941. All funds released.',
              }
            : a
        )
      );
      setIsProcessing(false);
      setActiveFinanceModal(null);
      setModalSuccessMessage('Payroll batch officially verified & released via Corporate Banking RTGS!');
      setTimeout(() => setModalSuccessMessage(''), 5000);
    }, 600);
  };

  // Handle Super Admin Wage Approval
  const handleConfirmSuperWageApproval = (alertId: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId
            ? {
                ...a,
                status: 'RESOLVED',
                resolvedNote: 'Executive MD approval recorded. Passed to Finance clearance.',
              }
            : a
        )
      );
      setIsProcessing(false);
      setActiveSuperWageModal(null);
      setModalSuccessMessage('Department wage sheet approved by Executive Office.');
      setTimeout(() => setModalSuccessMessage(''), 5000);
    }, 600);
  };

  return (
    <div className="space-y-3">
      {/* Success Notification Bar */}
      {modalSuccessMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-semibold">{modalSuccessMessage}</span>
        </div>
      )}

      {/* Alert Cards Container */}
      <div className="space-y-3">
        {roleAlerts.map((alert) => {
          const isResolved = alert.status === 'RESOLVED';

          return (
            <div
              key={alert.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isResolved
                  ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-80'
                  : alert.badgeColor === 'amber'
                  ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/60'
                  : alert.badgeColor === 'purple'
                  ? 'bg-purple-50/60 dark:bg-purple-950/20 border-purple-200/80 dark:border-purple-800/60'
                  : 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-800/60'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider ${
                        isResolved
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          : alert.badgeColor === 'amber'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                          : alert.badgeColor === 'purple'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 border border-purple-300 dark:border-purple-700'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border border-blue-300 dark:border-blue-700'
                      }`}
                    >
                      {isResolved ? 'ACTION COMPLETED' : alert.badge}
                    </span>

                    {alert.submittedBy && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        From: <strong className="text-slate-700 dark:text-slate-300">{alert.submittedBy}</strong>
                      </span>
                    )}

                    <span className="text-[11px] text-slate-400">
                      • {alert.timestamp}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {isResolved ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    )}
                    <span>{alert.title}</span>
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                    {isResolved ? alert.resolvedNote : alert.description}
                  </p>
                </div>

                {/* Right Action Trigger Buttons */}
                {!isResolved && (
                  <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                    {alert.secondaryActionHref && (
                      <Link
                        href={alert.secondaryActionHref}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition"
                      >
                        {alert.secondaryActionLabel || 'Inspect Details'}
                      </Link>
                    )}

                    {alert.primaryActionType === 'modal_finance_payout' ? (
                      <button
                        type="button"
                        onClick={() => setActiveFinanceModal(alert)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-sm flex items-center gap-1.5"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        <span>{alert.primaryActionLabel}</span>
                      </button>
                    ) : alert.primaryActionType === 'modal_super_admin_wage' ? (
                      <button
                        type="button"
                        onClick={() => setActiveSuperWageModal(alert)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-sm flex items-center gap-1.5"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>{alert.primaryActionLabel}</span>
                      </button>
                    ) : (
                      <Link
                        href={alert.primaryActionHref || '#'}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition shadow-sm flex items-center gap-1.5"
                      >
                        <span>{alert.primaryActionLabel}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: FINANCE IN-DASHBOARD PAYOUT RELEASE MODAL */}
      {activeFinanceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Finance Review & Payment Release
                </h3>
              </div>
              <button
                onClick={() => setActiveFinanceModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Department / Batch:</span>
                <strong className="text-slate-800 dark:text-slate-200">Line 1 SMT & Precision Assembly (October 2026)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Factory Technicians:</span>
                <strong className="text-slate-800 dark:text-slate-200">144 Workers</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gross Earnings:</span>
                <strong className="text-slate-800 dark:text-slate-200">₹38,40,000</strong>
              </div>
              <div className="flex justify-between text-indigo-600 dark:text-indigo-400">
                <span>Statutory Deductions (ESI + PF):</span>
                <strong>-₹4,89,600</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-800 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                <span>Net Bank Payout Amount:</span>
                <span>₹33,21,600</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Statutory Cross-Verification Checklist:</div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Biometric turnstile punches matched against factory entry gates.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Statutory PF (12%) and ESI (0.75%) calculation verified.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Corporate banking API connected: <strong>HDFC Corporate Banking RTGS/NEFT</strong>.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveFinanceModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleConfirmFinanceRelease(activeFinanceModal.id)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <Check className="h-4 w-4" />
                <span>{isProcessing ? 'Releasing Funds...' : 'Verify & Release Payout via RTGS'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SUPER ADMIN EXECUTIVE WAGE AUTHORIZATION MODAL */}
      {activeSuperWageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Executive MD Authorization
                </h3>
              </div>
              <button
                onClick={() => setActiveSuperWageModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Line 1 Production Manager Suresh Raina submitted the monthly attendance and shift overtime sheet for <strong>Precision Controller & Motherboard Assembly</strong>.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span>Total Technicians:</span>
                <strong>5 Shift Engineers</strong>
              </div>
              <div className="flex justify-between">
                <span>Authorized Overtime:</span>
                <strong>60 Shift Hours</strong>
              </div>
              <div className="flex justify-between font-bold text-indigo-600 dark:text-indigo-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                <span>Department Net Total:</span>
                <span>₹1,09,095</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveSuperWageModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleConfirmSuperWageApproval(activeSuperWageModal.id)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <Check className="h-4 w-4" />
                <span>{isProcessing ? 'Authorizing...' : 'Authorize Department Wage Sheet'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
