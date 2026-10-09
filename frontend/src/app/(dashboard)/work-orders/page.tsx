import { Factory, Plus, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const sampleWorkOrders = [
  {
    orderNumber: 'WO-2026-0001',
    product: 'Precision Hydraulic Pump Assembly',
    sku: 'FG-PMP-100',
    quantity: 50,
    produced: 20,
    scrapped: 1,
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    startDate: '2026-10-05',
    endDate: '2026-10-12',
    supervisor: 'Marcus Vance',
  },
  {
    orderNumber: 'WO-2026-0002',
    product: 'Heavy Duty Transmission Housing',
    sku: 'FG-TRN-200',
    quantity: 120,
    produced: 102,
    scrapped: 3,
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    startDate: '2026-10-02',
    endDate: '2026-10-08',
    supervisor: 'Sarah Connor',
  },
  {
    orderNumber: 'WO-2026-0003',
    product: 'High-Torque Drive Shaft Rotor',
    sku: 'FG-RTR-350',
    quantity: 30,
    produced: 0,
    scrapped: 0,
    status: 'RELEASED',
    priority: 'CRITICAL',
    startDate: '2026-10-10',
    endDate: '2026-10-16',
    supervisor: 'Marcus Vance',
  },
  {
    orderNumber: 'WO-2026-0004',
    product: 'Electronic Control Module Box',
    sku: 'FG-ECM-050',
    quantity: 200,
    produced: 0,
    scrapped: 0,
    status: 'PLANNED',
    priority: 'LOW',
    startDate: '2026-10-15',
    endDate: '2026-10-22',
    supervisor: 'Elena Rostova',
  },
];

export default function WorkOrdersPage() {
  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Work Orders & Production Scheduling
          </h1>
          <p className="text-sm text-slate-500">
            Create, release, schedule, and track manufacturing shop floor execution.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> New Work Order
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Production Orders Schedule</CardTitle>
          <CardDescription>
            Showing all active, scheduled, and completed shop floor orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">Order Number</th>
                  <th className="pb-3">Product Name & SKU</th>
                  <th className="pb-3">Target / Produced</th>
                  <th className="pb-3">Scrap</th>
                  <th className="pb-3">Schedule Window</th>
                  <th className="pb-3">Supervisor</th>
                  <th className="pb-3">Priority</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                {sampleWorkOrders.map((order) => (
                  <tr key={order.orderNumber} className="hover:bg-slate-50/50">
                    <td className="py-3 font-semibold text-blue-600">
                      {order.orderNumber}
                    </td>
                    <td className="py-3">
                      <div className="font-semibold text-slate-900">{order.product}</div>
                      <div className="text-[11px] text-slate-400">{order.sku}</div>
                    </td>
                    <td className="py-3">
                      <span className="font-semibold text-slate-900">{order.produced}</span>
                      <span className="text-slate-400"> / {order.quantity} PCS</span>
                    </td>
                    <td className="py-3 text-rose-600 font-semibold">
                      {order.scrapped > 0 ? `${order.scrapped} PCS` : '0'}
                    </td>
                    <td className="py-3 text-[11px] text-slate-500">
                      {order.startDate} → {order.endDate}
                    </td>
                    <td className="py-3 text-slate-700">{order.supervisor}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          order.priority === 'CRITICAL' || order.priority === 'HIGH'
                            ? 'danger'
                            : 'default'
                        }
                      >
                        {order.priority}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          order.status === 'IN_PROGRESS'
                            ? 'info'
                            : order.status === 'COMPLETED'
                            ? 'success'
                            : 'default'
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
