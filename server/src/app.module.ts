import { Module } from '@nestjs/common';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { FinanceModule } from './modules/finance/finance.module';
import { ProductionModule } from './modules/production/production.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { QualityModule } from './modules/quality/quality.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { LogisticsGateModule } from './modules/logistics-gate/logistics-gate.module';
import { HrModule } from './modules/hr/hr.module';
import { SystemAdminModule } from './modules/system-admin/system-admin.module';
import { AssetReliabilityModule } from './modules/asset-reliability/asset-reliability.module';
import { SubcontractingModule } from './modules/subcontracting/subcontracting.module';
import { SupplyChainModule } from './modules/supply-chain/supply-chain.module';
import { FieldServiceModule } from './modules/field-service/field-service.module';
import { ProcurementModule } from './modules/procurement/procurement.module';
import { CrmModule } from './modules/crm/crm.module';
import { DepartmentWorkforceModule } from './modules/department-workforce/department-workforce.module';
import { MarketingModule } from './modules/marketing/marketing.module';
import { DesignEngineeringModule } from './modules/design-engineering/design-engineering.module';
import { FleetTransportModule } from './modules/fleet-transport/fleet-transport.module';
import { PricingControlModule } from './modules/pricing-control/pricing-control.module';
import { MobileManufacturingModule } from './modules/mobile-manufacturing/mobile-manufacturing.module';
import { TaskDelegationModule } from './modules/task-delegation/task-delegation.module';
import { LeaveModule } from './modules/leave-management/leave.module';
import { PayrollCredModule } from './modules/payroll-cred/payroll-cred.module';
import { DepartmentPayrollModule } from './modules/department-payroll/department-payroll.module';
import { AdminRbacModule } from './modules/admin-rbac/admin-rbac.module';
import { SalaryAuditModule } from './modules/salary-audit/salary-audit.module';

@Module({
  imports: [
    SalaryAuditModule,
    AdminRbacModule,
    SuperAdminModule,
    FinanceModule,
    ProductionModule,
    WarehouseModule,
    QualityModule,
    DispatchModule,
    LogisticsGateModule,
    HrModule,
    SystemAdminModule,
    AssetReliabilityModule,
    SubcontractingModule,
    SupplyChainModule,
    FieldServiceModule,
    ProcurementModule,
    CrmModule,
    DepartmentWorkforceModule,
    MarketingModule,
    DesignEngineeringModule,
    FleetTransportModule,
    PricingControlModule,
    MobileManufacturingModule,
    TaskDelegationModule,
    LeaveModule,
    PayrollCredModule,
    DepartmentPayrollModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

