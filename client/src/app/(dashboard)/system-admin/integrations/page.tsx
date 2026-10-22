'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Cpu,
  Wifi,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  RotateCcw,
  Zap,
  Terminal,
  Activity,
  Layers,
  Printer,
  Scale,
  Barcode,
  Radio,
  Sliders,
} from 'lucide-react';
import {
  HardwareIntegrationItem,
  HardwareDeviceType,
  HardwareDeviceStatus,
} from '@/types/system-admin';

const INITIAL_DEVICES: HardwareIntegrationItem[] = [
  {
    id: 'hw-1',
    deviceCode: 'HW-SCN-001',
    deviceName: 'Warehouse Dock Handheld GS1 Scanner',
    deviceType: 'BARCODE_SCANNER',
    ipAddress: '192.168.10.101',
    macAddress: '00:1B:44:11:3A:B7',
    portNumber: 9100,
    communicationProtocol: 'WEBSOCKET',
    location: 'Warehouse Receiving Bay 01',
    status: 'ONLINE',
    lastHeartbeat: '2026-10-07 17:15',
    firmwareVersion: 'v3.2.1-Zebra',
    calibrationDueDate: '2027-01-15',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'hw-2',
    deviceCode: 'HW-SCALE-001',
    deviceName: 'Heavy Inbound Weighbridge 60-Ton Platform',
    deviceType: 'WEIGHING_SCALE',
    ipAddress: '192.168.10.120',
    portNumber: 502,
    communicationProtocol: 'MODBUS_TCP',
    location: 'North Gate 01 Weighbridge Pit',
    status: 'ONLINE',
    lastHeartbeat: '2026-10-07 17:18',
    firmwareVersion: 'v5.0-AveryWeightronix',
    calibrationDueDate: '2026-12-31',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'hw-3',
    deviceCode: 'HW-IOT-VIB-01',
    deviceName: 'CNC Spindle 15kW Tri-Axial Vibration Sensor',
    deviceType: 'IOT_SENSOR',
    ipAddress: '10.0.4.15',
    portNumber: 1883,
    communicationProtocol: 'MQTT',
    location: 'CNC Milling Line 02 (DMG Mori)',
    status: 'ONLINE',
    lastHeartbeat: '2026-10-07 17:20',
    firmwareVersion: 'v2.8-IFM-IoT',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'hw-4',
    deviceCode: 'HW-PRN-001',
    deviceName: 'High-Speed Thermal Transfer Barcode Printer',
    deviceType: 'LABEL_PRINTER',
    ipAddress: '192.168.10.115',
    portNumber: 9100,
    communicationProtocol: 'REST_API',
    location: 'Dispatch Carton Packing Station 01',
    status: 'ONLINE',
    lastHeartbeat: '2026-10-07 17:10',
    firmwareVersion: 'v4.1-TSC-Print',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'hw-5',
    deviceCode: 'HW-IOT-VIB-02',
    deviceName: 'Conveyor Roller Bearing Temperature Probe',
    deviceType: 'IOT_SENSOR',
    ipAddress: '10.0.4.18',
    portNumber: 1883,
    communicationProtocol: 'MQTT',
    location: 'Assembly Conveyor Line 04',
    status: 'DEGRADED',
    lastHeartbeat: '2026-10-07 15:42',
    firmwareVersion: 'v2.8-IFM-IoT',
    calibrationDueDate: '2026-10-01',
    createdAt: '',
    updatedAt: '',
  },
];

export default function HardwareIntegrationsPage() {
  const [devices, setDevices] = useState<HardwareIntegrationItem[]>(INITIAL_DEVICES);
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // New Device Form
  const [formData, setFormData] = useState({
    deviceCode: '',
    deviceName: '',
    deviceType: 'BARCODE_SCANNER' as HardwareDeviceType,
    ipAddress: '',
    portNumber: 9100,
    communicationProtocol: 'MQTT',
    location: '',
    firmwareVersion: 'v1.0.0',
    calibrationDueDate: '',
  });

  const handleRegisterDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.deviceCode || !formData.deviceName) return;

    const newDevice: HardwareIntegrationItem = {
      id: `hw-${Date.now()}`,
      deviceCode: formData.deviceCode.toUpperCase(),
      deviceName: formData.deviceName,
      deviceType: formData.deviceType,
      ipAddress: formData.ipAddress,
      portNumber: Number(formData.portNumber),
      communicationProtocol: formData.communicationProtocol,
      location: formData.location || 'Plant Floor',
      status: 'ONLINE',
      lastHeartbeat: new Date().toISOString().replace('T', ' ').substring(0, 16),
      firmwareVersion: formData.firmwareVersion,
      calibrationDueDate: formData.calibrationDueDate || undefined,
      createdAt: '',
      updatedAt: '',
    };

    setDevices([newDevice, ...devices]);
    setIsRegisterModalOpen(false);
    setFormData({
      deviceCode: '',
      deviceName: '',
      deviceType: 'BARCODE_SCANNER',
      ipAddress: '',
      portNumber: 9100,
      communicationProtocol: 'MQTT',
      location: '',
      firmwareVersion: 'v1.0.0',
      calibrationDueDate: '',
    });
  };

  const handleSendCommand = (code: string, command: string) => {
    alert(`Dispatched [${command}] to ${code}. Command acknowledged with status: 200 OK.`);
  };

  const filtered = devices.filter((d) => {
    const matchesType = deviceTypeFilter === 'ALL' || d.deviceType === deviceTypeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      d.deviceCode.toLowerCase().includes(q) ||
      d.deviceName.toLowerCase().includes(q) ||
      d.location.toLowerCase().includes(q) ||
      (d.ipAddress && d.ipAddress.includes(q));
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Link href="/system-admin" className="hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Infrastructure Command
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200">Hardware & IoT Integrations</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Hardware Integrations & IoT Telemetry Portal
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Connect industrial weighing scales, barcode scanners, PLC controllers, and machine telemetry sensors via MQTT/Modbus.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 transition-colors w-fit"
        >
          <Plus className="h-4 w-4" />
          Register New Device
        </button>
      </div>

      {/* Protocol Gateway Health Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">MQTT Broker (IoT)</span>
            <div className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">tcp://10.0.4.1:1883</div>
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Modbus TCP Bridge</span>
            <div className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">Port 502 (Weighbridge)</div>
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Zebra Raw 9100 Print</span>
            <div className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">Label Buffers Active</div>
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Heartbeat Polling</span>
            <div className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">Every 15 Seconds</div>
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-sm">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search device code, name, IP, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full transition"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
            {['ALL', 'BARCODE_SCANNER', 'WEIGHING_SCALE', 'IOT_SENSOR', 'LABEL_PRINTER'].map((t) => (
              <button
                key={t}
                onClick={() => setDeviceTypeFilter(t)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  deviceTypeFilter === t
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {t === 'ALL' ? 'All' : t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Showing <span className="text-slate-900 dark:text-white font-semibold">{filtered.length}</span> devices
        </div>
      </div>

      {/* Hardware Devices Table */}
      <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-3 font-semibold">Device Code</th>
                <th className="py-3 px-3 font-semibold">Name & Category</th>
                <th className="py-3 px-3 font-semibold">IP Address & Port</th>
                <th className="py-3 px-3 font-semibold">Protocol</th>
                <th className="py-3 px-3 font-semibold">Plant Location</th>
                <th className="py-3 px-3 font-semibold">Last Heartbeat</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold text-right">Device Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filtered.map((dev) => (
                <tr key={dev.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-300">
                    {dev.deviceCode}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 dark:text-white tracking-wide">{dev.deviceName}</div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{dev.deviceType}</span>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <div className="text-slate-900 dark:text-white">{dev.ipAddress || 'Serial / Direct'}</div>
                    {dev.portNumber && <div className="text-[10px] text-slate-500 dark:text-slate-400">Port: {dev.portNumber}</div>}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-50 dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 text-cyan-700 dark:text-cyan-300 font-semibold">
                      {dev.communicationProtocol}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-800 dark:text-slate-200 font-medium">
                    {dev.location}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {dev.lastHeartbeat || 'Offline'}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        dev.status === 'ONLINE'
                          ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                          : dev.status === 'DEGRADED'
                          ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30'
                          : 'bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30'
                      }`}
                    >
                      {dev.status === 'ONLINE' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                      {dev.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {dev.deviceType === 'WEIGHING_SCALE' && (
                        <button
                          onClick={() => handleSendCommand(dev.deviceCode, 'TARE_CALIBRATE')}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-medium transition"
                          title="Trigger Zero Tare"
                        >
                          Zero Tare
                        </button>
                      )}

                      {dev.deviceType === 'LABEL_PRINTER' && (
                        <button
                          onClick={() => handleSendCommand(dev.deviceCode, 'TEST_PRINT')}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-medium transition"
                          title="Send test alignment pattern"
                        >
                          Test Print
                        </button>
                      )}

                      <button
                        onClick={() => handleSendCommand(dev.deviceCode, 'REBOOT')}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-medium transition"
                        title="Reboot Device"
                      >
                        Ping / Reset
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Device Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Register Hardware Peripheral / IoT Node</h3>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterDevice} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Device Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="HW-SCN-002"
                    value={formData.deviceCode}
                    onChange={(e) => setFormData({ ...formData, deviceCode: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white uppercase font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Device Classification *</label>
                  <select
                    value={formData.deviceType}
                    onChange={(e) => setFormData({ ...formData, deviceType: e.target.value as HardwareDeviceType })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="BARCODE_SCANNER">Barcode Scanner (GS1/QR)</option>
                    <option value="WEIGHING_SCALE">Weighing Scale / Pit Platform</option>
                    <option value="IOT_SENSOR">Machine IoT Telemetry Sensor</option>
                    <option value="LABEL_PRINTER">Industrial Label Printer</option>
                    <option value="TOUCH_TERMINAL">Shop Floor Touch Terminal</option>
                    <option value="PLC_CONTROLLER">PLC Industrial Automation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Device Descriptive Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weighbridge Pit 02 Gross Digitiser"
                  value={formData.deviceName}
                  onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">IP Address</label>
                  <input
                    type="text"
                    placeholder="192.168.10.XXX"
                    value={formData.ipAddress}
                    onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Port</label>
                  <input
                    type="number"
                    value={formData.portNumber}
                    onChange={(e) => setFormData({ ...formData, portNumber: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Protocol</label>
                  <select
                    value={formData.communicationProtocol}
                    onChange={(e) => setFormData({ ...formData, communicationProtocol: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="MQTT">MQTT (v3.1.1 / v5.0)</option>
                    <option value="MODBUS_TCP">Modbus TCP (Industrial)</option>
                    <option value="WEBSOCKET">WebSocket / RAW TCP</option>
                    <option value="REST_API">REST API HTTP Webhook</option>
                    <option value="SERIAL_RS232">Serial RS-232 / USB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Physical Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Weighbridge Pit 02"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/30 transition"
                >
                  Register & Bind Socket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
