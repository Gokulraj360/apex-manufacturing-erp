'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileCheck,
  RotateCcw,
  Wrench,
  Trash2,
  Package,
  Layers,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowLeft,
  X,
  FileText,
  Calendar,
  Building,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SpecialGatePassItem, GatePassType } from '@/types/logistics-gate';

const INITIAL_SPECIAL_PASSES: SpecialGatePassItem[] = [
  {
    id: 'pass-1',
    passNumber: 'SGP-2026-0034',
    passType: 'EQUIPMENT_REPAIR',
    departmentOrigin: 'CNC Precision Milling Division',
    destinationParty: 'Siemens Industrial Service Center',
    authorizedPerson: 'Anil Kulkarni (Maintenance Head)',
    authorizedPhone: '+91 98220 44551',
    reason: 'Spindle motor rewinding and harmonic balance recalibration',
    itemListJson: [
      {
        itemCode: 'EQ-MTR-4001',
        description: 'CNC Siemens Servo Spindle Motor 15kW',
        quantity: 1,
        serialNumbers: 'SN-MTR-88201-B',
      },
      {
        itemCode: 'EQ-DRV-102',
        description: 'Harmonic Drive Encoder Module',
        quantity: 1,
        serialNumbers: 'SN-ENC-9912',
      },
    ],
    expectedReturnDate: '2026-10-15',
    isReturnable: true,
    isReturned: false,
    approvalStatus: 'APPROVED',
    securityVerifiedOutAt: '2026-10-07 10:20',
    verifiedOutByGuardId: 'usr-guard-01',
    notes: 'Outward gate pass signed. Awaiting return post repair.',
    createdAt: '2026-10-07 09:30',
    updatedAt: '2026-10-07 10:20',
  },
  {
    id: 'pass-2',
    passNumber: 'SGP-2026-0035',
    passType: 'RETURNABLE_PACKAGING',
    departmentOrigin: 'Warehouse Dispatch Staging',
    destinationParty: 'Bharat Heavy Dynamics Ltd',
    authorizedPerson: 'Rajesh Mehra (Dispatch Supervisor)',
    authorizedPhone: '+91 98900 12345',
    reason: 'Steel pallet bins loaned for batch delivery transport',
    itemListJson: [
      {
        itemCode: 'PKG-PLT-HEAVY',
        description: 'Heavy Gauge Galvanized Steel Pallet Bins (Euro Size)',
        quantity: 12,
        serialNumbers: 'PAL-001 to PAL-012',
      },
    ],
    expectedReturnDate: '2026-10-10',
    isReturnable: true,
    isReturned: false,
    approvalStatus: 'APPROVED',
    securityVerifiedOutAt: '2026-10-07 11:30',
    verifiedOutByGuardId: 'usr-guard-02',
    notes: 'Loaned along with DC-2026-018.',
    createdAt: '2026-10-07 11:00',
    updatedAt: '2026-10-07 11:30',
  },
  {
    id: 'pass-3',
    passNumber: 'SGP-2026-0033',
    passType: 'SCRAP_REMOVAL',
    departmentOrigin: 'Fabrication Workshop',
    destinationParty: 'Universal Scrap Recyclers',
    authorizedPerson: 'P. Nair (Plant Safety Officer)',
    authorizedPhone: '+91 97654 32190',
    reason: 'Authorized disposal of MS metal swarf and stamping trim',
    itemListJson: [
      {
        itemCode: 'SCRAP-MS-01',
        description: 'Mild Steel Punching Scrap & Offcuts',
        quantity: 3450,
        serialNumbers: 'Batch SCR-2026-OCT',
      },
    ],
    isReturnable: false,
    isReturned: true,
    approvalStatus: 'APPROVED',
    securityVerifiedOutAt: '2026-10-07 08:45',
    verifiedOutByGuardId: 'usr-guard-01',
    notes: 'Non-returnable. Tare and gross weights certified by weighbridge operator.',
    createdAt: '2026-10-07 08:15',
    updatedAt: '2026-10-07 08:45',
  },
];

export default function SpecialGatePassesPage() {
  const [passes, setPasses] = useState<SpecialGatePassItem[]>(INITIAL_SPECIAL_PASSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [passTypeFilter, setPassTypeFilter] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Pass Form
  const [formData, setFormData] = useState({
    passType: 'EQUIPMENT_REPAIR' as GatePassType,
    departmentOrigin: '',
    destinationParty: '',
    authorizedPerson: '',
    authorizedPhone: '',
    reason: '',
    expectedReturnDate: '',
    isReturnable: true,
    itemDescription: '',
    itemQuantity: 1,
    itemSerial: '',
  });

  const handleCreatePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.destinationParty || !formData.authorizedPerson) return;

    const newPass: SpecialGatePassItem = {
      id: `pass-${Date.now()}`,
      passNumber: `SGP-2026-00${36 + passes.length}`,
      passType: formData.passType,
      departmentOrigin: formData.departmentOrigin || 'Plant Operations',
      destinationParty: formData.destinationParty,
      authorizedPerson: formData.authorizedPerson,
      authorizedPhone: formData.authorizedPhone || '+91 90000 00000',
      reason: formData.reason || 'Approved outward transfer',
      itemListJson: [
        {
          description: formData.itemDescription || 'Special material items',
          quantity: Number(formData.itemQuantity) || 1,
          serialNumbers: formData.itemSerial || 'N/A',
        },
      ],
      expectedReturnDate: formData.isReturnable ? formData.expectedReturnDate : undefined,
      isReturnable: formData.isReturnable,
      isReturned: false,
      approvalStatus: 'APPROVED',
      securityVerifiedOutAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      verifiedOutByGuardId: 'usr-guard-01',
      notes: 'Outward gate pass generated & authorized.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPasses([newPass, ...passes]);
    setIsCreateModalOpen(false);
    setFormData({
      passType: 'EQUIPMENT_REPAIR',
      departmentOrigin: '',
      destinationParty: '',
      authorizedPerson: '',
      authorizedPhone: '',
      reason: '',
      expectedReturnDate: '',
      isReturnable: true,
      itemDescription: '',
      itemQuantity: 1,
      itemSerial: '',
    });
  };

  const handleVerifyReturn = (passId: string) => {
    setPasses((prev) =>
      prev.map((p) =>
        p.id === passId
          ? {
              ...p,
              isReturned: true,
              approvalStatus: 'RETURNED' as const,
              securityVerifiedInAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              actualReturnDate: new Date().toISOString().replace('T', ' ').substring(0, 10),
              verifiedInByGuardId: 'usr-guard-01',
              notes: 'Return verified and physical equipment inspected by guard.',
              updatedAt: new Date().toISOString(),
            }
          : p,
      ),
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filtered = passes.filter((p) => {
    const matchesType = passTypeFilter === 'ALL' || p.passType === passTypeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.passNumber.toLowerCase().includes(q) ||
      p.destinationParty.toLowerCase().includes(q) ||
      p.authorizedPerson.toLowerCase().includes(q) ||
      p.reason.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/logistics-gate" className="hover:text-cyan-400 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Logistics
            </Link>
            <span>/</span>
            <span className="text-slate-200">Special Gate Passes</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-purple-400" />
            Special Gate Pass Authorizations & Return Verification
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Digital tracking of non-commercial items exiting the facility: machine repairs, scrap disposal, subcontractor processing, and returnable packaging.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-lg shadow-purple-600/20 transition-colors w-fit"
        >
          <Plus className="h-4 w-4" />
          Issue Special Gate Pass
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0d1322] border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search pass #, destination, authorizer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-full"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            {['ALL', 'EQUIPMENT_REPAIR', 'RETURNABLE_PACKAGING', 'SCRAP_REMOVAL'].map((t) => (
              <button
                key={t}
                onClick={() => setPassTypeFilter(t)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  passTypeFilter === t
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'ALL' ? 'All' : t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-purple-400" />
          <span>Audit Registry: Enforced Zero-Loss Protocol</span>
        </div>
      </div>

      {/* Special Passes List */}
      <div className="space-y-3">
        {filtered.map((pass) => (
          <div
            key={pass.id}
            className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors"
          >
            <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                    pass.passType === 'EQUIPMENT_REPAIR'
                      ? 'bg-blue-500/15 text-blue-400'
                      : pass.passType === 'RETURNABLE_PACKAGING'
                      ? 'bg-amber-500/15 text-amber-400'
                      : 'bg-emerald-500/15 text-emerald-400'
                  }`}
                >
                  {pass.passType === 'EQUIPMENT_REPAIR' ? (
                    <Wrench className="h-5 w-5" />
                  ) : pass.passType === 'RETURNABLE_PACKAGING' ? (
                    <RotateCcw className="h-5 w-5" />
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">{pass.passNumber}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      {pass.passType.replace('_', ' ')}
                    </span>
                    {pass.isReturnable ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <RotateCcw className="h-2.5 w-2.5" /> Returnable
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        Non-Returnable
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-300 mt-1">
                    Destination: <span className="text-white font-semibold">{pass.destinationParty}</span> &bull; Dept: <span className="text-slate-400">{pass.departmentOrigin}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Reason: &ldquo;{pass.reason}&rdquo; &bull; Authorized By: {pass.authorizedPerson}
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-3 justify-between lg:justify-end">
                <div className="text-right text-xs">
                  {pass.isReturnable && !pass.isReturned && (
                    <div className="text-amber-400 font-medium text-[11px]">
                      Expected Return: {pass.expectedReturnDate || 'TBD'}
                    </div>
                  )}
                  {pass.isReturned && (
                    <div className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Returned & Re-inspected
                    </div>
                  )}
                  <div className="text-slate-500 text-[10px]">Out: {pass.securityVerifiedOutAt}</div>
                </div>

                <div className="flex items-center gap-2">
                  {pass.isReturnable && !pass.isReturned && (
                    <button
                      onClick={() => handleVerifyReturn(pass.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Verify Gate Return
                    </button>
                  )}

                  <button
                    onClick={() => toggleExpand(pass.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="View item line breakdown"
                  >
                    {expandedId === pass.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Expandable item table */}
            {expandedId === pass.id && (
              <div className="bg-slate-900/80 border-t border-slate-800/80 p-4">
                <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-cyan-400" />
                  Itemized Material Breakdown ({pass.itemListJson.length} items)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-800">
                        <th className="py-1.5 px-2">Item Code</th>
                        <th className="py-1.5 px-2">Description</th>
                        <th className="py-1.5 px-2">Quantity</th>
                        <th className="py-1.5 px-2">Serial Numbers / Identifiers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 text-slate-300">
                      {pass.itemListJson.map((it, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-2 font-mono text-cyan-300">{it.itemCode || '---'}</td>
                          <td className="py-2 px-2 text-white font-medium">{it.description}</td>
                          <td className="py-2 px-2 font-mono">{it.quantity}</td>
                          <td className="py-2 px-2 font-mono text-slate-400">{it.serialNumbers || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Special Gate Pass Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-purple-400" />
                <h3 className="text-base font-semibold text-white">Issue Special Gate Pass</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePass} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Pass Category *</label>
                  <select
                    value={formData.passType}
                    onChange={(e) => setFormData({ ...formData, passType: e.target.value as GatePassType })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="EQUIPMENT_REPAIR">Equipment Repair / Calibration</option>
                    <option value="RETURNABLE_PACKAGING">Returnable Packaging / Pallets</option>
                    <option value="SCRAP_REMOVAL">Scrap Removal / Metal Swarf</option>
                    <option value="SUBCONTRACTOR_PROCESSING">Subcontractor Job Work</option>
                    <option value="CUSTOMER_DEMO">Customer Demonstration Unit</option>
                    <option value="HAZARDOUS_DISPOSAL">Hazardous Waste Disposal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Origin Department</label>
                  <input
                    type="text"
                    placeholder="e.g. CNC Workshop"
                    value={formData.departmentOrigin}
                    onChange={(e) => setFormData({ ...formData, departmentOrigin: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Destination Vendor / Party *</label>
                  <input
                    type="text"
                    required
                    placeholder="Recipient company name"
                    value={formData.destinationParty}
                    onChange={(e) => setFormData({ ...formData, destinationParty: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Authorizing Officer *</label>
                  <input
                    type="text"
                    required
                    placeholder="HOD or Safety Head"
                    value={formData.authorizedPerson}
                    onChange={(e) => setFormData({ ...formData, authorizedPerson: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Reason for Removal</label>
                <input
                  type="text"
                  placeholder="Detailed justification for taking items outside plant"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Item detail fields */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-slate-300 block">Primary Item Details</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Item Description *</label>
                    <input
                      type="text"
                      placeholder="e.g. Servo Motor 15kW"
                      value={formData.itemDescription}
                      onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.itemQuantity}
                      onChange={(e) => setFormData({ ...formData, itemQuantity: parseInt(e.target.value) || 1 })}
                      className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Serial Number(s) / Identification</label>
                  <input
                    type="text"
                    placeholder="e.g. SN-88201-B"
                    value={formData.itemSerial}
                    onChange={(e) => setFormData({ ...formData, itemSerial: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chkReturnable"
                    checked={formData.isReturnable}
                    onChange={(e) => setFormData({ ...formData, isReturnable: e.target.checked })}
                    className="rounded border-slate-700 text-purple-600 focus:ring-0"
                  />
                  <label htmlFor="chkReturnable" className="text-xs text-slate-200 cursor-pointer">
                    Returnable to factory premises
                  </label>
                </div>

                {formData.isReturnable && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">Due:</span>
                    <input
                      type="date"
                      value={formData.expectedReturnDate}
                      onChange={(e) => setFormData({ ...formData, expectedReturnDate: e.target.value })}
                      className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium shadow-md shadow-purple-600/30"
                >
                  Authorize Gate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
