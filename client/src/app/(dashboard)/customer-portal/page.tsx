'use client';

import React, { useState } from 'react';
import { generateAndDownloadWordDoc } from '@/lib/wordDocumentGenerator';
import {
  Users,
  Activity,
  Award,
  RotateCcw,
  Receipt,
  Download,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ShieldCheck,
  QrCode,
  FileText,
  Package,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  ExternalLink,
} from 'lucide-react';

interface ClientWorkOrderProgress {
  id: string;
  orderNumber: string;
  contractPoRef: string;
  deviceModel: string;
  orderedQuantity: number;
  completedQuantity: number;
  currentStage: 'SMT_BOARD_FABRICATION' | 'OPTICAL_ALIGNMENT' | 'RF_5G_CALIBRATION' | 'FINAL_PACKAGING' | 'DISPATCH_READY';
  percentComplete: number;
  targetDispatchDate: string;
  qualityPassingRate: number;
}

interface QualityCertificateItem {
  id: string;
  certNumber: string;
  workOrderRef: string;
  batchNumber: string;
  deviceModel: string;
  inspectorLead: string;
  inspectionDate: string;
  rohsCompliant: boolean;
  reachCompliant: boolean;
  dropTestPassed: boolean;
  pdfDownloadUrl: string;
}

interface CustomerRMAItem {
  id: string;
  rmaNumber: string;
  deviceSerialUid: string;
  deviceModel: string;
  reportedDefect: string;
  failureCategory: 'SENSOR_ARRAY_UNRESPONSIVE' | 'BATTERY_THERMAL_SHUTDOWN' | 'RF_5G_DROP' | 'CAMERA_FOCUS_BLUR';
  createdDate: string;
  status: 'PENDING_TRIAGE' | 'RETURN_LABEL_ISSUED' | 'DEVICE_RECEIVED_INSPECTED' | 'REPLACED_CREDITED';
  warrantyStatus: 'ACTIVE_UNDER_WARRANTY' | 'EXPIRED';
}

interface ClientInvoiceRecord {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  invoiceDate: string;
  totalAmount: number;
  taxAmount: number;
  paymentStatus: 'PAID' | 'PAYMENT_DUE' | 'PARTIALLY_PAID';
  pdfUrl: string;
}

const MOCK_CLIENT_ORDERS: ClientWorkOrderProgress[] = [
  {
    id: 'cwo-1',
    orderNumber: 'SO-CLI-2026-0912',
    contractPoRef: 'CLI-PO-88190',
    deviceModel: 'Apex Industrial Module Pro (Titanium Series)',
    orderedQuantity: 5000,
    completedQuantity: 3820,
    currentStage: 'RF_5G_CALIBRATION',
    percentComplete: 76.4,
    targetDispatchDate: '2026-10-28',
    qualityPassingRate: 99.4,
  },
  {
    id: 'cwo-2',
    orderNumber: 'SO-CLI-2026-0935',
    contractPoRef: 'CLI-PO-88240',
    deviceModel: 'Apex Core Automation Unit (Enterprise Series)',
    orderedQuantity: 10000,
    completedQuantity: 2400,
    currentStage: 'SMT_BOARD_FABRICATION',
    percentComplete: 24.0,
    targetDispatchDate: '2026-11-12',
    qualityPassingRate: 98.9,
  },
  {
    id: 'cwo-3',
    orderNumber: 'SO-CLI-2026-0880',
    contractPoRef: 'CLI-PO-88001',
    deviceModel: 'Apex Precision Controller Ultra (Modular Series)',
    orderedQuantity: 2000,
    completedQuantity: 2000,
    currentStage: 'DISPATCH_READY',
    percentComplete: 100,
    targetDispatchDate: '2026-10-20',
    qualityPassingRate: 99.8,
  },
];

const MOCK_CERTIFICATES: QualityCertificateItem[] = [
  {
    id: 'cert-1',
    certNumber: 'COC-APEX-2026-0499',
    workOrderRef: 'SO-CLI-2026-0880',
    batchNumber: 'BATCH-UF-2026-09A',
    deviceModel: 'Apex Precision Controller Ultra',
    inspectorLead: 'S. Kulkarni (Quality Director)',
    inspectionDate: '2026-10-19',
    rohsCompliant: true,
    reachCompliant: true,
    dropTestPassed: true,
    pdfDownloadUrl: '/certs/COC-2026-0499.pdf',
  },
  {
    id: 'cert-2',
    certNumber: 'COC-APEX-2026-0482',
    workOrderRef: 'SO-CLI-2026-0850',
    batchNumber: 'BATCH-EP-2026-08D',
    deviceModel: 'Apex Industrial Module Pro',
    inspectorLead: 'M. Deshmukh (Lead Metrologist)',
    inspectionDate: '2026-10-10',
    rohsCompliant: true,
    reachCompliant: true,
    dropTestPassed: true,
    pdfDownloadUrl: '/certs/COC-2026-0482.pdf',
  },
];

const MOCK_RMAS: CustomerRMAItem[] = [
  {
    id: 'rma-1',
    rmaNumber: 'RMA-APEX-2026-0041',
    deviceSerialUid: '869012059942109',
    deviceModel: 'Apex Industrial Module Pro',
    reportedDefect: 'Touch digitizer ghost touching after cold boot',
    failureCategory: 'SENSOR_ARRAY_UNRESPONSIVE',
    createdDate: '2026-10-20',
    status: 'RETURN_LABEL_ISSUED',
    warrantyStatus: 'ACTIVE_UNDER_WARRANTY',
  },
  {
    id: 'rma-2',
    rmaNumber: 'RMA-APEX-2026-0038',
    deviceSerialUid: '869012059881024',
    deviceModel: 'Apex Core Automation Unit',
    reportedDefect: 'Battery thermals throttling charging speed to 5W',
    failureCategory: 'BATTERY_THERMAL_SHUTDOWN',
    createdDate: '2026-10-14',
    status: 'REPLACED_CREDITED',
    warrantyStatus: 'ACTIVE_UNDER_WARRANTY',
  },
];

const MOCK_INVOICES: ClientInvoiceRecord[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-APEX-CLI-0901',
    orderNumber: 'SO-CLI-2026-0880',
    invoiceDate: '2026-10-20',
    totalAmount: 1840000,
    taxAmount: 331200,
    paymentStatus: 'PAID',
    pdfUrl: '/invoices/INV-0901.pdf',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-APEX-CLI-0915',
    orderNumber: 'SO-CLI-2026-0912',
    invoiceDate: '2026-10-22',
    totalAmount: 3450000,
    taxAmount: 621000,
    paymentStatus: 'PAYMENT_DUE',
    pdfUrl: '/invoices/INV-0915.pdf',
  },
];

export default function CustomerPortalPage() {
  const [activeTab, setActiveTab] = useState<'tracking' | 'coc' | 'rma' | 'billing'>('tracking');
  const [orders] = useState<ClientWorkOrderProgress[]>(MOCK_CLIENT_ORDERS);
  const [certificates] = useState<QualityCertificateItem[]>(MOCK_CERTIFICATES);
  const [rmas, setRmas] = useState<CustomerRMAItem[]>(MOCK_RMAS);
  const [invoices] = useState<ClientInvoiceRecord[]>(MOCK_INVOICES);

  // New RMA Modal State
  const [isRmaModalOpen, setIsRmaModalOpen] = useState(false);
  const [newImei, setNewImei] = useState('');
  const [newModel, setNewModel] = useState('Apex Industrial Module Pro');
  const [newCategory, setNewCategory] = useState<CustomerRMAItem['failureCategory']>('SENSOR_ARRAY_UNRESPONSIVE');
  const [newRemarks, setNewRemarks] = useState('');

  const handleCreateRma = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: CustomerRMAItem = {
      id: `rma-${Date.now()}`,
      rmaNumber: `RMA-APEX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      deviceSerialUid: newImei || '869012059900112',
      deviceModel: newModel,
      reportedDefect: newRemarks || 'Diagnostic failure reported during QA',
      failureCategory: newCategory,
      createdDate: new Date().toISOString().slice(0, 10),
      status: 'RETURN_LABEL_ISSUED',
      warrantyStatus: 'ACTIVE_UNDER_WARRANTY',
    };
    setRmas([newEntry, ...rmas]);
    setIsRmaModalOpen(false);
    setNewImei('');
    setNewRemarks('');
  };

  const handleDownloadCoCDoc = (cert: QualityCertificateItem) => {
    generateAndDownloadWordDoc(`Apex_Certificate_of_Conformance_${cert.certNumber}`, {
      title: 'CERTIFIED CERTIFICATE OF CONFORMANCE & QUALITY ACCEPTANCE (CoC)',
      documentRef: cert.certNumber,
      classification: 'OFFICIAL CERTIFICATE — AEROSPACE & TELECOM INDUSTRIAL QUALITY ASSURANCE',
      department: 'Corporate Quality Assurance & Metrology Laboratory',
      author: cert.inspectorLead,
      date: cert.inspectionDate,
      summary: `Official statement of quality verification and conformance certifying that hardware batch ${cert.batchNumber} (${cert.deviceModel}) has been 100% manufactured, assembled, and tested in full compliance with ISO 9001:2015, IATF 16949, IPC-A-610 Class 3, and customer contract specification ${cert.workOrderRef}.`,
      sections: [
        {
          heading: 'Manufacturing Batch & Hardware Traceability',
          table: {
            headers: ['Traceability Parameter', 'Verified Batch Record', 'Standard & Verification Specification'],
            rows: [
              ['Certificate Identification', cert.certNumber, 'Cryptographically Stamped & Digitally Signed'],
              ['Device Model / Nomenclature', cert.deviceModel, 'Quad-Band 5G High-Reliability Industrial Terminal'],
              ['Production Lot / Batch ID', cert.batchNumber, 'Cleanroom Bay 4 Surface Mount Placement'],
              ['Work Order Authorization', cert.workOrderRef, 'Commercial Client Master Purchase Order'],
              ['Inspection Date & Shift', cert.inspectionDate, 'QA Station 4 Shift A Automated Optical Inspection'],
              ['QA Lead Inspector', cert.inspectorLead, 'IPC-A-610 Certified Metrology Specialist'],
            ],
          },
        },
        {
          heading: 'Environmental & Hazardous Material Compliance',
          callout: {
            title: 'Full RoHS 3 & REACH SVHC Compliance Confirmed',
            text: 'Independent laboratory screening verifies lead-free soldering (< 1000 ppm Pb) and zero presence of 235 Substances of Very High Concern (SVHC) per EU Directive 2011/65/EU and Regulation (EC) No 1907/2006.',
            type: 'success',
          },
          table: {
            headers: ['Regulatory Directive', 'Permissible Threshold', 'Measured Concentration', 'Compliance Verification'],
            rows: [
              ['EU RoHS 3 (Directive 2015/863)', 'Lead (Pb) < 1,000 ppm', '< 45 ppm (XRF Tested)', 'PASSED (Fully Compliant)'],
              ['EU REACH Regulation 1907/2006', 'SVHC < 0.1% w/w', '0.00% Not Detected', 'PASSED (Fully Compliant)'],
              ['Dodd-Frank Act Section 1502', 'Conflict Free (3TG)', 'Smelters Audited RMI', 'PASSED (Conflict-Free Certified)'],
              ['Halogen-Free IEC 61249-2-21', 'Br < 900 ppm, Cl < 900 ppm', '< 120 ppm Aggregate', 'PASSED (Halogen-Free Compliant)'],
            ],
          },
        },
        {
          heading: 'Laboratory Physical & RF Metrology Test Results',
          content: [
            'Every serialized unit in this production lot underwent automated test equipment (ATE) verification across high-frequency RF transmission, power rail dissipation, and mechanical durability.',
          ],
          table: {
            headers: ['Test Protocol', 'Target Specification Limits', 'Measured Batch Average', 'Test Result'],
            rows: [
              ['Sub-6GHz RF 5G Tx Power', '+23.0 dBm ± 1.5 dBm', '+23.4 dBm Peak Power', 'PASSED (Zero Deviation)'],
              ['Optical Calibration & Telemetry Accuracy', 'Delta-E (ΔE) < 1.5', 'ΔE = 0.82 Chromaticity', 'PASSED (Calibrated)'],
              ['1.5-Meter Mechanical Drop Test', '0 Structural / Optical Cracks', '6-Axis Drop Validated', 'PASSED (MIL-STD-810H)'],
              ['ESD Static Discharge Immunity', '±8kV Contact / ±15kV Air', 'IEC 61000-4-2 Level 4', 'PASSED (No Latch-up)'],
              ['Continuous Burn-in Thermal Test', '72 Hours @ 50°C 85% RH', 'Zero Thermal Throttling', 'PASSED (100% Reliability)'],
            ],
          },
        },
      ],
      signatories: [
        {
          name: cert.inspectorLead,
          role: 'Lead Metrology & Quality Assurance Inspector',
          organization: 'Apex Manufacturing Quality Directorate',
          signatureDate: cert.inspectionDate,
        },
        {
          name: 'David O\'Connor',
          role: 'VP Quality & Product Reliability',
          organization: 'Apex Manufacturing Technologies Corporation',
          signatureDate: cert.inspectionDate,
        },
      ],
    });
  };

  const handleDownloadInvoiceDoc = (inv: ClientInvoiceRecord) => {
    generateAndDownloadWordDoc(`Apex_Tax_Invoice_${inv.invoiceNumber}`, {
      title: 'COMMERCIAL TAX INVOICE & STATEMENT OF REMITTANCE',
      documentRef: inv.invoiceNumber,
      classification: 'OFFICIAL COMMERCIAL INVOICE — FINANCIAL ACCOUNTS RECORD',
      department: 'Corporate Accounts Receivable & Treasury',
      author: 'Commercial Billing Operations',
      date: inv.invoiceDate,
      summary: `Commercial B2B tax invoice and delivery billing slip for Purchase Order ${inv.orderNumber}. All charges represent contracted deliverable hardware assemblies and certified packaging.`,
      sections: [
        {
          heading: 'Invoice Billing & Client Account Information',
          table: {
            headers: ['Invoice Field', 'Verified Billing Record', 'Payment Terms & Remittance'],
            rows: [
              ['Invoice Number', inv.invoiceNumber, 'Official Commercial Tax Bill'],
              ['Sales Order Reference', inv.orderNumber, 'Binding Client PO Contract'],
              ['Issue Date', inv.invoiceDate, 'Net 30 Payment Terms'],
              ['Payment Status', inv.paymentStatus, inv.paymentStatus === 'PAID' ? 'Fully Settled via Wire' : 'Due Within 30 Calendar Days'],
              ['Billed Client Entity', 'AeroDynamics Defense & Space LLC', 'Vendor ID: APEX-VND-99210'],
            ],
          },
        },
        {
          heading: 'Itemized Deliverables & Tax Breakdown',
          table: {
            headers: ['Item / SKU Description', 'Contracted Deliverable', 'Tax (GST 18%)', 'Total Extended Price (USD)'],
            rows: [
              ['Apex Industrial Edge Gateway Gen 3', 'High-Density Assemblies with CoC', `$${inv.taxAmount.toLocaleString()}`, `$${(inv.totalAmount - inv.taxAmount).toLocaleString()}`],
              ['Commercial GST / Tax Remittance', 'Federal & State Value-Added Tax', '18.00% Standard Rate', `$${inv.taxAmount.toLocaleString()}`],
              ['Total Net Amount Payable', 'Full Commercial Settlement', 'USD Currency', `$${inv.totalAmount.toLocaleString()}`],
            ],
          },
        },
        {
          heading: 'Electronic Funds Wire & Banking Instructions',
          callout: {
            title: 'International SWIFT / Fedwire Banking Information',
            text: `Please remit total wire transfer of $${inv.totalAmount.toLocaleString()} referencing invoice number ${inv.invoiceNumber} to: JPMorgan Chase Bank, N.A., ABA Routing: 111000614, Swift: CHASUS33, Account: 4092-8812-9901.`,
            type: 'info',
          },
        },
      ],
      signatories: [
        {
          name: 'Samantha Sterling',
          role: 'Chief Financial Officer (CFO)',
          organization: 'Apex Manufacturing Technologies Corporation',
          signatureDate: inv.invoiceDate,
        },
      ],
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Users className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              B2B Commercial Client Portal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
              Account: Apex Global Telecom Enterprise & Distribution Group
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Monitor real-time assembly line WIP progression, download certified Certificates of Conformance (CoC), submit warranty RMA claims, and manage commercial invoices.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsRmaModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="h-4 w-4" /> Submit RMA Warranty Claim
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Devices in Production</span>
            <Activity className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">17,000 Units</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
            <span>3 Active Work Orders Live</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg First-Pass Yield</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">99.37%</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Exceeds SLA Target (98.5%)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active RMA Claims</span>
            <RotateCcw className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{rmas.filter(r => r.status !== 'REPLACED_CREDITED').length} In-Process</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Avg turnaround: 36 hrs</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Commercial Account</span>
            <Award className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Tier-1 Platinum</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
            <span>Dedicated Line Allocation</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('tracking')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'tracking'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Activity className="h-4 w-4" /> Live Assembly Line WIP Tracker ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('coc')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'coc'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="h-4 w-4" /> Certificates of Conformance (CoC) ({certificates.length})
        </button>
        <button
          onClick={() => setActiveTab('rma')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'rma'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <RotateCcw className="h-4 w-4" /> RMA & Warranty Claim Desk ({rmas.length})
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'billing'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Receipt className="h-4 w-4" /> Tax Invoices & Account Statements ({invoices.length})
        </button>
      </div>

      {/* TAB 1: WORK ORDER TRACKING */}
      {activeTab === 'tracking' && (
        <div className="space-y-4">
          {orders.map((wo) => (
            <div key={wo.id} className="p-5 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{wo.deviceModel}</h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold border border-blue-500/20">
                      {wo.orderNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Client PO Ref: <strong className="text-slate-700 dark:text-slate-300 font-mono">{wo.contractPoRef}</strong> • Target Dispatch: <strong>{wo.targetDispatchDate}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">First-Time Quality Pass</div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{wo.qualityPassingRate}%</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5 text-blue-500" />
                    Current Stage: <span className="text-blue-600 dark:text-blue-400 uppercase">{wo.currentStage.replace(/_/g, ' ')}</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {wo.completedQuantity.toLocaleString()} / {wo.orderedQuantity.toLocaleString()} Units ({wo.percentComplete}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      wo.percentComplete === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                    }`}
                    style={{ width: `${wo.percentComplete}%` }}
                  />
                </div>
              </div>

              {/* Stage Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div className="font-semibold text-slate-900 dark:text-white">1. SMT Board Fab</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-medium">Completed</div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div className="font-semibold text-slate-900 dark:text-white">2. Optical Fitting</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-medium">Completed</div>
                </div>
                <div className="p-2 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                  <div className="font-semibold text-blue-900 dark:text-blue-200">3. RF 5G Calibration</div>
                  <div className="text-blue-600 dark:text-blue-400 font-medium">In Progress</div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div className="font-semibold text-slate-500">4. Packaging & Barcode</div>
                  <div className="text-slate-400">Queued</div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div className="font-semibold text-slate-500">5. Final Dispatch</div>
                  <div className="text-slate-400">Scheduled</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: CERTIFICATES OF CONFORMANCE */}
      {activeTab === 'coc' && (
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Certified Certificates of Quality & Conformance (CoC)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Download laboratory test certificates for delivered hardware lots.</p>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {certificates.map((cert) => (
              <div key={cert.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-500" />
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{cert.certNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      QA Signed
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{cert.deviceModel} (Batch: {cert.batchNumber})</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Inspected by: {cert.inspectorLead} • Date: {cert.inspectionDate} • Order: <span className="font-mono">{cert.workOrderRef}</span>
                  </div>
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                    <span>✓ RoHS 3 Compliant</span>
                    <span>✓ REACH Certified</span>
                    <span>✓ Drop Test (1.5m) Passed</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadCoCDoc(cert)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
                  title="Download Official Certified Certificate of Conformance in Word Format"
                >
                  <Download className="h-3.5 w-3.5" /> Download Certified CoC (.doc)
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RMA & WARRANTY DESK */}
      {activeTab === 'rma' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Active Return Merchandise Authorizations (RMA)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Track warranty repairs, component replacements, and diagnostic triage.</p>
            </div>
            <button
              onClick={() => setIsRmaModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all"
            >
              <Plus className="h-3.5 w-3.5" /> New Warranty RMA
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rmas.map((rma) => (
              <div key={rma.id} className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono font-bold text-sm text-slate-900 dark:text-white">
                    <RotateCcw className="h-4 w-4 text-blue-500" />
                    {rma.rmaNumber}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    rma.status === 'REPLACED_CREDITED' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
                  }`}>
                    {rma.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <div><strong>Device:</strong> {rma.deviceModel}</div>
                  <div><strong>Serial / / Serial:</strong> <span className="font-mono text-purple-600 dark:text-purple-400">{rma.deviceSerialUid}</span></div>
                  <div><strong>Reported Failure:</strong> {rma.reportedDefect}</div>
                  <div><strong>Category:</strong> <span className="font-semibold text-slate-800 dark:text-slate-200">{rma.failureCategory.replace(/_/g, ' ')}</span></div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ {rma.warrantyStatus.replace(/_/g, ' ')}</span>
                  <button className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium">
                    Prepaid Shipping Label <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BILLING & STATEMENTS */}
      {activeTab === 'billing' && (
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Tax Invoices & Statement of Accounts</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Download commercial GST invoices and view statement reconciliation.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Sales Order #</th>
                  <th className="py-3 px-4">Invoice Date</th>
                  <th className="py-3 px-4">Tax (GST)</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">{inv.invoiceNumber}</td>
                    <td className="py-3.5 px-4 font-mono text-blue-600 dark:text-blue-400">{inv.orderNumber}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{inv.invoiceDate}</td>
                    <td className="py-3.5 px-4 text-slate-500">${inv.taxAmount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">${inv.totalAmount.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      {inv.paymentStatus === 'PAID' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          Paid in Full
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                          Payment Due (Net 30)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDownloadInvoiceDoc(inv)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded text-[11px] font-medium border border-slate-200 dark:border-slate-700 transition-all inline-flex items-center gap-1 hover:border-primary"
                        title="Download Commercial Tax Invoice in Word Format"
                      >
                        <Download className="h-3 w-3" /> Invoice (.doc)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT WARRANTY RMA */}
      {isRmaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">File Hardware RMA Warranty Claim</h3>
              <button onClick={() => setIsRmaModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateRma} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Unit Serial / Hardware UID</label>
                <input
                  type="text"
                  placeholder="e.g. 869012059942109"
                  value={newImei}
                  onChange={(e) => setNewImei(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Device Model</label>
                  <select
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Apex Industrial Module Pro">Apex Industrial Module Pro</option>
                    <option value="Apex Core Automation Unit">Apex Core Automation Unit</option>
                    <option value="Apex Precision Controller Ultra">Apex Precision Controller Ultra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Defect Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="SENSOR_ARRAY_UNRESPONSIVE">Precision Sensor Array Unresponsive</option>
                    <option value="BATTERY_THERMAL_SHUTDOWN">Battery Thermal Shutdown</option>
                    <option value="RF_5G_DROP">RF 5G Signal Drop</option>
                    <option value="CAMERA_FOCUS_BLUR">Camera Focus / OIS Failure</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Detailed Defect Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe failure conditions, diagnostic codes, or environmental symptoms..."
                  value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRmaModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Generate RMA & Return Slip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
