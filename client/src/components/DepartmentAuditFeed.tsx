'use client';

import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  User,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

export interface AuditFeedItem {
  id: string;
  department: string;
  actorName: string;
  actorRole: string;
  action: string;
  entity: string;
  details: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  timestamp: string;
  tamperChecksum: string;
  payload?: Record<string, any>;
}

// Pre-seeded authentic mobile manufacturing departmental audit records
const DEPARTMENT_AUDIT_DATABASE: Record<string, AuditFeedItem[]> = {
  finance: [
    {
      id: 'aud-fin-01',
      department: 'Finance & Accounts',
      actorName: 'Amitabh Sen',
      actorRole: 'Factory Accounts & Finance Lead',
      action: 'PAYOUT_DISBURSEMENT_RELEASED',
      entity: 'PayrollBatch',
      details: 'Approved & released September 2026 Shift Factory Payroll (144 Technicians · ₹33,21,600 net) via HDFC Corporate RTGS Ref: HDFC-CORP-RTGS-990412.',
      severity: 'CRITICAL',
      timestamp: 'Today, 11:00 AM',
      tamperChecksum: 'e9b3a165d491f0a597bf6819a5573428801d0ec2e99f57e62a04ec576c6b3e70',
      payload: { batchId: 'PAY-BATCH-2026-09', netDisbursed: 3321600, totalHeadcount: 144, statutoryPF: 460800, statutoryESI: 28800 },
    },
    {
      id: 'aud-fin-02',
      department: 'Finance & Accounts',
      actorName: 'Priya Nambiar',
      actorRole: 'Senior Accounts Officer',
      action: 'INVOICE_3WAY_MATCH',
      entity: 'VendorBill',
      details: 'Matched Qualcomm Enterprise Invoice #QC-9042 (₹1.45 Cr) against Inbound GRN-9021 and PO-9042 with 0 variance.',
      severity: 'INFO',
      timestamp: 'Today, 09:30 AM',
      tamperChecksum: '76d1e4ca51871e8c7921a8b111dc503284aa179603e87d291ba40192e4cc1862',
      payload: { poNumber: 'PO-2026-9042', invoiceAmount: 14500000, matchStatus: 'PERFECT_MATCH' },
    },
    {
      id: 'aud-fin-03',
      department: 'Finance & Accounts',
      actorName: 'Amitabh Sen',
      actorRole: 'Factory Accounts & Finance Lead',
      action: 'GST_TDS_RECONCILIATION',
      entity: 'TaxReport',
      details: 'Reconciled September GSTR-3B input tax credit against factory electricity and component purchase invoices.',
      severity: 'INFO',
      timestamp: 'Yesterday, 04:15 PM',
      tamperChecksum: 'b561c944f2ef98d0092adcf1b6a71e113a778b4efc9215c90b6a2f89c0e29b14',
    },
  ],

  warehouse: [
    {
      id: 'aud-wh-01',
      department: 'Warehouse & Parts Stock',
      actorName: 'Vikram Malhotra',
      actorRole: 'Parts & Phone Inventory Lead',
      action: 'INBOUND_GRN_RECEIPT',
      entity: 'MaterialStock',
      details: 'Received and verified 10,000 AMOLED 6.7" LTPO displays from BOE Tech. Barcode scans 100% matched to PO-9018.',
      severity: 'INFO',
      timestamp: 'Today, 09:15 AM',
      tamperChecksum: '3a18e001cfa976db5761bc99a71649d21f8502aef1803577d33b5c43d5483f98',
      payload: { itemCode: 'PART-DISP-LTPO', quantityReceived: 10000, binLocation: 'RACK-A2-TRAY-04', grnRef: 'GRN-2026-9021' },
    },
    {
      id: 'aud-wh-02',
      department: 'Warehouse & Parts Stock',
      actorName: 'Prakash Rao',
      actorRole: 'Chipset Storage Bin Handler',
      action: 'STOCK_BUFFER_RESERVATION',
      entity: 'MaterialStock',
      details: 'Reserved 2,500 Snapdragon 8 Gen 3 chipsets for Morning Shift Assembly Line 1 work order WO-2026-049.',
      severity: 'INFO',
      timestamp: 'Today, 07:45 AM',
      tamperChecksum: '8f7a62d312bc85c697841f39e9444f9f743ab1a38481283d0bf59c3a649ef201',
    },
    {
      id: 'aud-wh-03',
      department: 'Warehouse & Parts Stock',
      actorName: 'Santosh Gowda',
      actorRole: 'Barcode & QR Scanner Staff',
      action: 'IMEI_SIM_REGISTRATION',
      entity: 'SerializedDevice',
      details: 'Scanned and registered 1,200 unique device IMEI numbers onto secure factory SIM registry for batch APEX-PRO-BLK.',
      severity: 'INFO',
      timestamp: 'Yesterday, 06:00 PM',
      tamperChecksum: '113a778b4efc9215c90b6a2f89c0e29b14b561c944f2ef98d0092adcf1b6a71e',
    },
  ],

  production: [
    {
      id: 'aud-prod-01',
      department: 'Phone Assembly Lines',
      actorName: 'Suresh Raina',
      actorRole: 'Line 1 Production Manager',
      action: 'DEPARTMENT_WAGE_SUBMISSION',
      entity: 'DepartmentPayrollSheet',
      details: 'Compiled and submitted Line 1 SMT attendance & shift overtime roster (5 Technicians · 60 OT hrs · ₹1,09,095 net) to HR & Finance.',
      severity: 'INFO',
      timestamp: 'Today, 09:30 AM',
      tamperChecksum: 'b561c944f2ef98d0092adcf1b6a71e113a778b4efc9215c90b6a2f89c0e29b14',
      payload: { departmentCode: 'SMT-001', workersCount: 5, totalNetDisbursement: 109095, overtimeHoursTotal: 60 },
    },
    {
      id: 'aud-prod-02',
      department: 'Phone Assembly Lines',
      actorName: 'Ananya Deshmukh',
      actorRole: 'Cleanroom Line Manager',
      action: 'LINE_YIELD_TARGET_REACHED',
      entity: 'WorkOrder',
      details: 'Line 2 completed 2,450 units of dust-free OLED screen fittings for WO-2026-049 with 99.1% First Pass Yield.',
      severity: 'INFO',
      timestamp: 'Today, 08:00 AM',
      tamperChecksum: 'a71e8c7921a8b111dc503284aa179603e87d291ba40192e4cc1862b561c944f2',
    },
    {
      id: 'aud-prod-03',
      department: 'Phone Assembly Lines',
      actorName: 'Rameshwar Patil',
      actorRole: 'SMT Machine Operator',
      action: 'STENCIL_PRINTER_CALIBRATION',
      entity: 'AssetMachine',
      details: 'Completed solder paste thickness optical check on Pick-and-Place Machine SMT-01. Calibration variance < 0.01mm.',
      severity: 'INFO',
      timestamp: 'Today, 06:15 AM',
      tamperChecksum: '76d1e4ca51871e8c7921a8b111dc503284aa179603e87d291ba40192e4cc1862',
    },
  ],

  hr: [
    {
      id: 'aud-hr-01',
      department: 'Human Resources',
      actorName: 'Kavita Menon',
      actorRole: 'Factory Workers & Shift Rosters Lead',
      action: 'PAYROLL_BATCH_SUBMISSION',
      entity: 'PayrollBatch',
      details: 'Submitted October 2026 Factory Payroll Batch (144 Technicians · ₹38,40,000 gross) to Finance and Super Admin inboxes.',
      severity: 'CRITICAL',
      timestamp: 'Today, 10:15 AM',
      tamperChecksum: 'e9b3a165d491f0a597bf6819a5573428801d0ec2e99f57e62a04ec576c6b3e70',
      payload: { batchNumber: 'PAY-BATCH-2026-10', totalHeadcount: 144, grossWages: 3840000, status: 'PENDING_FINANCE_VERIFICATION' },
    },
    {
      id: 'aud-hr-02',
      department: 'Human Resources',
      actorName: 'Kavita Menon',
      actorRole: 'Factory Workers & Shift Rosters Lead',
      action: 'TURNSTILE_PUNCH_RECONCILIATION',
      entity: 'AttendanceLog',
      details: 'Reconciled 136 morning shift turnstile punches against scheduled roster. 3 approved leaves and 5 field duty passes recorded.',
      severity: 'INFO',
      timestamp: 'Today, 08:30 AM',
      tamperChecksum: '8f7a62d312bc85c697841f39e9444f9f743ab1a38481283d0bf59c3a649ef201',
    },
    {
      id: 'aud-hr-03',
      department: 'Human Resources',
      actorName: 'Sunil Rao',
      actorRole: 'Production Floor Supervisor',
      action: 'LEAVE_REQUEST_APPROVAL',
      entity: 'LeaveRequest',
      details: 'Approved 2 days casual leave for Line 1 technician Anil Jadhav after verifying backup operator availability.',
      severity: 'INFO',
      timestamp: 'Yesterday, 03:00 PM',
      tamperChecksum: '3a18e001cfa976db5761bc99a71649d21f8502aef1803577d33b5c43d5483f98',
    },
  ],

  quality: [
    {
      id: 'aud-qa-01',
      department: 'Phone Quality Checks',
      actorName: 'Dr. Anand Verma',
      actorRole: 'Phone Quality & Signal Testing Lead',
      action: 'QUALITY_YIELD_CERTIFICATION',
      entity: 'QualityBatch',
      details: 'Logged 99.4% First Pass Yield (FPY) on SMT Line 1 motherboards. RF chamber 5G antenna test passed with 0 defect ppm.',
      severity: 'INFO',
      timestamp: 'Today, 11:20 AM',
      tamperChecksum: '3a18e001cfa976db5761bc99a71649d21f8502aef1803577d33b5c43d5483f98',
      payload: { passRate: 99.4, testStation: 'RF-ANECHOIC-02', defectPPM: 0 },
    },
    {
      id: 'aud-qa-02',
      department: 'Phone Quality Checks',
      actorName: 'Priya Sharma',
      actorRole: 'Cleanroom Optical Quality Inspector',
      action: 'OPTICAL_DISPLAY_INSPECTION',
      entity: 'DisplayPanel',
      details: 'Completed sub-pixel laser inspection on 500 BOE LTPO AMOLED panels. 1 panel flagged for edge light bleed and quarantined.',
      severity: 'WARNING',
      timestamp: 'Today, 08:40 AM',
      tamperChecksum: 'a71e8c7921a8b111dc503284aa179603e87d291ba40192e4cc1862b561c944f2',
      payload: { inspectedCount: 500, rejectedCount: 1, quarantineBin: 'Q-BIN-DISP-09' },
    },
  ],

  fleet: [
    {
      id: 'aud-flt-01',
      department: 'Fleet & Delivery Vehicles',
      actorName: 'Rajesh Gurung',
      actorRole: 'Delivery Trucks & Fleet Lead',
      action: 'CONVOY_DISPATCH_DEPARTURE',
      entity: 'FleetTrip',
      details: 'Dispatched 5-truck convoy KA-04-ME-4821 carrying 10,000 Apex Pro 5G units to Bangalore International Air Cargo Hub.',
      severity: 'INFO',
      timestamp: 'Today, 07:10 AM',
      tamperChecksum: '8f7a62d312bc85c697841f39e9444f9f743ab1a38481283d0bf59c3a649ef201',
      payload: { vehicleCode: 'KA-04-ME-4821', destination: 'BLR Air Cargo Hub', unitsEscorted: 10000 },
    },
  ],

  'supply-chain': [
    {
      id: 'aud-scm-01',
      department: 'Supply Chain & Sourcing',
      actorName: 'Karthik Raman',
      actorRole: 'Material Planning & Sourcing Lead',
      action: 'MRP_SHORTAGE_FORECAST',
      entity: 'MaterialRequisition',
      details: 'Generated automatic purchase order recommendation for 5,000 Sony IMX989 camera sensors to prevent Week 3 line stoppage.',
      severity: 'INFO',
      timestamp: 'Today, 10:05 AM',
      tamperChecksum: '76d1e4ca51871e8c7921a8b111dc503284aa179603e87d291ba40192e4cc1862',
      payload: { partCode: 'PART-CAM-50MP', suggestedOrderQty: 5000, safetyBufferDays: 14 },
    },
  ],
};

export function DepartmentAuditFeed({
  department,
  title = 'Department Activity & Historical Audit Trail',
}: {
  department: 'finance' | 'warehouse' | 'production' | 'hr' | 'quality' | 'fleet' | 'supply-chain' | string;
  title?: string;
}) {
  const [search, setSearch] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const logs = DEPARTMENT_AUDIT_DATABASE[department] || [];

  const filteredLogs = logs.filter((log) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      log.actorName.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> SHA-256 Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cryptographically sealed ledger of every mutation, submission, and transaction performed by department staff.
          </p>
        </div>

        {/* Filter Input */}
        <div className="relative w-full sm:w-64">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search events, actors, actions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Feed List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No audit records matching your filter.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;

            return (
              <div
                key={log.id}
                className="p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        log.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                          : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                      }`}
                    >
                      {log.action.replace(/_/g, ' ')}
                    </span>

                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {log.actorName}
                    </span>

                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      ({log.actorRole})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <Clock className="h-3 w-3" />
                    <span>{log.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {log.details}
                </p>

                {/* Footer strip with checksum and details toggle */}
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono">
                  <span className="truncate max-w-md">
                    HMAC: {log.tamperChecksum.slice(0, 24)}...
                  </span>

                  {log.payload && (
                    <button
                      type="button"
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide Payload' : 'Inspect Payload'}</span>
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                  )}
                </div>

                {/* Expanded Payload Details */}
                {isExpanded && log.payload && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-900 text-slate-200 text-[11px] font-mono overflow-x-auto border border-slate-800">
                    <pre>{JSON.stringify(log.payload, null, 2)}</pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
