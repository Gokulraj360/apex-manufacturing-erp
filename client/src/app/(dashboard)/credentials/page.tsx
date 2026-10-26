'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  UserPlus,
  ShieldCheck,
  KeyRound,
  CreditCard,
  Building2,
  DollarSign,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
  Plus,
  Coins,
  BadgeCheck,
  Check,
  Eye,
  EyeOff,
  UserX,
  RotateCcw,
  Briefcase,
  Mail,
  Lock,
  Phone,
  MapPin,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { ALL_ROLES } from '@/types/auth';
import { EmployeeCredentialItem } from '@/types/payroll-cred';
import { userCredentialVault, VaultUser } from '@/lib/userCredentialVault';

const STAFF_STORAGE_KEY = 'apex_credentials_staff_list_v2';

// 21 Pre-seeded corporate roles + technicians with full profile, salary, bank, email & passwords
const INITIAL_STAFF: EmployeeCredentialItem[] = [
  {
    id: 'cred-1',
    employeeId: 'APX-EXEC-001',
    name: 'Dr. Arthur Rajesh',
    email: 'owner@apexcorp.com',
    password: '123',
    phone: '+1 (512) 890-4100',
    nationalId: 'US-TX-998201',
    address: 'Austin Headquarters & Flagship Plant, Texas, USA',
    role: 'super_admin',
    roleTitle: 'Top Management (Owner / Managing Director)',
    department: 'Executive MD Office',
    accessPermissions: ['ALL_ENTERPRISE_CONTROLS', 'GOVERNANCE_SIGN_OFF', 'CAPEX_ALLOCATION'],
    username: 'super_admin',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'EXECUTIVE',
    dateOfJoining: '2020-01-01',
    salaryStructure: {
      basicSalary: 250000,
      hraAllowance: 100000,
      conveyanceAllowance: 25000,
      specialAllowance: 75000,
      grossSalary: 450000,
      esiDeduction: 0,
      pfDeduction: 30000,
      professionalTax: 2500,
      totalDeductions: 32500,
      netSalary: 417500,
      bankName: 'JPMorgan Chase Bank',
      accountNumber: '982019482019',
      ifscCode: 'CHASUS33',
      panNumber: 'EXECP001A',
      uanNumber: '100100100101',
      esiNumber: null,
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2020-01-01T08:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'cred-2',
    employeeId: 'APX-FIN-002',
    name: 'Samantha Sterling',
    email: 'finance@apexcorp.com',
    password: '1234',
    phone: '+1 (512) 890-4102',
    nationalId: 'US-TX-881920',
    address: 'Austin Campus, Financial Operations Hub, TX',
    role: 'finance',
    roleTitle: 'Factory Accounts & Finance Lead',
    department: 'Finance & Accounts Desk',
    accessPermissions: ['GENERAL_LEDGER', '3_WAY_AP_MATCH', 'TREASURY_DISBURSAL'],
    username: 'finance_manager',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2021-03-15',
    salaryStructure: {
      basicSalary: 120000,
      hraAllowance: 48000,
      conveyanceAllowance: 12000,
      specialAllowance: 30000,
      grossSalary: 210000,
      esiDeduction: 0,
      pfDeduction: 14400,
      professionalTax: 1200,
      totalDeductions: 15600,
      netSalary: 194400,
      bankName: 'Bank of America',
      accountNumber: '401928471928',
      ifscCode: 'BOFAUS3N',
      panNumber: 'FINAP002B',
      uanNumber: '100100100102',
      esiNumber: null,
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2021-03-15T09:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'cred-3',
    employeeId: 'APX-OPS-003',
    name: 'Alexander Vance',
    email: 'production@apexcorp.com',
    password: '1234',
    phone: '+1 (512) 890-4103',
    nationalId: 'US-TX-771239',
    address: 'Cleanroom Production Facility Bay 1-4, Austin',
    role: 'production',
    roleTitle: 'Plant Assembly Operations Lead',
    department: 'Precision Assembly Lines',
    accessPermissions: ['WORK_ORDER_RELEASE', 'BOM_DISPATCH', 'LINE_OEE_OVERRIDE'],
    username: 'production_lead',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2021-06-01',
    salaryStructure: {
      basicSalary: 110000,
      hraAllowance: 44000,
      conveyanceAllowance: 10000,
      specialAllowance: 26000,
      grossSalary: 190000,
      esiDeduction: 0,
      pfDeduction: 13200,
      professionalTax: 1200,
      totalDeductions: 14400,
      netSalary: 175600,
      bankName: 'Wells Fargo',
      accountNumber: '392019482011',
      ifscCode: 'WFBIUS6S',
      panNumber: 'OPSAP003C',
      uanNumber: '100100100103',
      esiNumber: null,
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2021-06-01T09:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'cred-4',
    employeeId: 'APX-QA-004',
    name: 'Elena Rostova',
    email: 'quality@apexcorp.com',
    password: '1234',
    phone: '+49 711 9820-4104',
    nationalId: 'DE-BW-992019',
    address: 'Stuttgart Advanced Optical Lab, Germany',
    role: 'quality',
    roleTitle: 'Precision Quality & Testing Lead',
    department: 'Quality Assurance & Testing',
    accessPermissions: ['QC_GATE_SIGN_OFF', 'DEFECT_AUDIT', 'HARDWARE_DIAGNOSTICS'],
    username: 'quality_lead',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2022-02-10',
    salaryStructure: {
      basicSalary: 95000,
      hraAllowance: 38000,
      conveyanceAllowance: 8000,
      specialAllowance: 21000,
      grossSalary: 162000,
      esiDeduction: 0,
      pfDeduction: 11400,
      professionalTax: 1000,
      totalDeductions: 12400,
      netSalary: 149600,
      bankName: 'Deutsche Bank',
      accountNumber: 'DE89370400440532013000',
      ifscCode: 'DEUTDEDB',
      panNumber: 'QAAP004D',
      uanNumber: '100100100104',
      esiNumber: null,
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2022-02-10T09:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'cred-5',
    employeeId: 'APX-SCM-005',
    name: 'Marcus Chen',
    email: 'supplychain@apexcorp.com',
    password: '1234',
    phone: '+65 6790 4105',
    nationalId: 'SG-S9820192A',
    address: 'Jurong Logistics Hub, Singapore',
    role: 'supply_chain',
    roleTitle: 'Global Supply Chain & Demand Lead',
    department: 'Supply Chain & Material Planning',
    accessPermissions: ['MRP_RUNNER', 'BUFFER_STOCK_ALLOCATION', 'SHORTAGE_FORECAST'],
    username: 'scm_lead',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2022-04-18',
    salaryStructure: {
      basicSalary: 105000,
      hraAllowance: 42000,
      conveyanceAllowance: 9000,
      specialAllowance: 24000,
      grossSalary: 180000,
      esiDeduction: 0,
      pfDeduction: 12600,
      professionalTax: 1200,
      totalDeductions: 13800,
      netSalary: 166200,
      bankName: 'DBS Bank Singapore',
      accountNumber: 'SG028910492819',
      ifscCode: 'DBSSSGSG',
      panNumber: 'SCMAP005E',
      uanNumber: '100100100105',
      esiNumber: null,
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2022-04-18T09:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'cred-6',
    employeeId: 'APX-PROC-006',
    name: 'Sarah Jenkins',
    email: 'procurement@apexcorp.com',
    password: '1234',
    phone: '+1 (512) 890-4106',
    nationalId: 'US-TX-662910',
    address: 'Austin Procurement Office, TX',
    role: 'procurement',
    roleTitle: 'Strategic Procurement & Supplier Lead',
    department: 'Procurement & Vendor Desk',
    accessPermissions: ['PO_AUTHORIZE', 'VENDOR_RATE_LOCK', 'RFQ_COMMISSION'],
    username: 'procurement_lead',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2022-08-01',
    salaryStructure: {
      basicSalary: 98000,
      hraAllowance: 39200,
      conveyanceAllowance: 8800,
      specialAllowance: 22000,
      grossSalary: 168000,
      esiDeduction: 0,
      pfDeduction: 11760,
      professionalTax: 1000,
      totalDeductions: 12760,
      netSalary: 155240,
      bankName: 'Citibank',
      accountNumber: '551029481920',
      ifscCode: 'CITIUS33',
      panNumber: 'PROCAP006F',
      uanNumber: '100100100106',
      esiNumber: null,
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2022-08-01T09:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'cred-7',
    employeeId: 'APX-WH-007',
    name: 'David Kim',
    email: 'warehouse@apexcorp.com',
    password: '1234',
    phone: '+1 (512) 890-4107',
    nationalId: 'US-TX-551029',
    address: 'Central High-Bay Automated Warehouse, Austin',
    role: 'warehouse',
    roleTitle: 'Raw Materials & Inventory Master Lead',
    department: 'Raw Materials & Inventory Control',
    accessPermissions: ['BIN_STOCK_RECONCILE', 'LOT_DISPATCH', 'CYCLE_COUNT_AUDIT'],
    username: 'warehouse_mgr',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2022-10-10',
    salaryStructure: {
      basicSalary: 85000,
      hraAllowance: 34000,
      conveyanceAllowance: 7000,
      specialAllowance: 18000,
      grossSalary: 144000,
      esiDeduction: 0,
      pfDeduction: 10200,
      professionalTax: 1000,
      totalDeductions: 11200,
      netSalary: 132800,
      bankName: 'PNC Bank',
      accountNumber: '291049281029',
      ifscCode: 'PNCCUS33',
      panNumber: 'WHAP007G',
      uanNumber: '100100100107',
      esiNumber: null,
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2022-10-10T09:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'cred-8',
    employeeId: 'APX-SUB-008',
    name: 'Rajat Verma',
    email: 'subcontracting@apexcorp.com',
    password: '1234',
    phone: '+91 98200 41008',
    nationalId: 'IN-MH-881920',
    address: 'Bengaluru Component Fabrication Cluster, India',
    role: 'subcontracting',
    roleTitle: 'Job-Work & Subcontracting Lead',
    department: 'External Manufacturing Job-Work',
    accessPermissions: ['CHALLAN_GENERATE', 'OUTSOURCE_RECONCILIATION'],
    username: 'subcontract_lead',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2023-01-05',
    salaryStructure: {
      basicSalary: 75000,
      hraAllowance: 30000,
      conveyanceAllowance: 6000,
      specialAllowance: 15000,
      grossSalary: 126000,
      esiDeduction: 0,
      pfDeduction: 9000,
      professionalTax: 500,
      totalDeductions: 9500,
      netSalary: 116500,
      bankName: 'HDFC Bank',
      accountNumber: '50100392810492',
      ifscCode: 'HDFC0001824',
      panNumber: 'SUBAP008H',
      uanNumber: '100100100108',
      esiNumber: null,
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2023-01-05T09:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'cred-9',
    employeeId: 'APX-ENG-009',
    name: 'Chloe Bennett',
    email: 'design@apexcorp.com',
    password: '1234',
    phone: '+1 (512) 890-4109',
    nationalId: 'US-TX-441029',
    address: 'R&D Mechatronics Design Center, Austin',
    role: 'design',
    roleTitle: 'CAD & Industrial Engineering Lead',
    department: 'Product Design & Engineering',
    accessPermissions: ['CAD_RELEASE', 'BOM_VERSION_SIGN_OFF', 'ECN_APPROVE'],
    username: 'design_lead',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2023-02-15',
    salaryStructure: {
      basicSalary: 115000,
      hraAllowance: 46000,
      conveyanceAllowance: 10000,
      specialAllowance: 27000,
      grossSalary: 198000,
      esiDeduction: 0,
      pfDeduction: 13800,
      professionalTax: 1200,
      totalDeductions: 15000,
      netSalary: 183000,
      bankName: 'Silicon Valley Bank',
      accountNumber: '772019482019',
      ifscCode: 'SVBUS33',
      panNumber: 'ENGAP009I',
      uanNumber: '100100100109',
      esiNumber: null,
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2023-02-15T09:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'cred-10',
    employeeId: 'APX-DISP-010',
    name: 'Carlos Mendez',
    email: 'dispatch@apexcorp.com',
    password: '1234',
    phone: '+1 (512) 890-4110',
    nationalId: 'US-TX-331029',
    address: 'Outbound Loading Dock & Packaging Line 6',
    role: 'dispatch',
    roleTitle: 'Packaging & Outbound Logistics Lead',
    department: 'Final Packaging & Dispatch',
    accessPermissions: ['BARCODE_GENERATE', 'PALLET_SEAL', 'SHIPPING_MANIFEST'],
    username: 'dispatch_lead',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2023-04-01',
    salaryStructure: {
      basicSalary: 70000,
      hraAllowance: 28000,
      conveyanceAllowance: 6000,
      specialAllowance: 14000,
      grossSalary: 118000,
      esiDeduction: 0,
      pfDeduction: 8400,
      professionalTax: 500,
      totalDeductions: 8900,
      netSalary: 109100,
      bankName: 'Regions Bank',
      accountNumber: '882019481920',
      ifscCode: 'RGBKUS44',
      panNumber: 'DISAP010J',
      uanNumber: '100100100110',
      esiNumber: null,
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2023-04-01T09:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'cred-11',
    employeeId: 'APX-FLT-011',
    name: 'Michael Scott',
    email: 'fleet@apexcorp.com',
    password: '1234',
    phone: '+1 (512) 890-4111',
    nationalId: 'US-TX-221029',
    address: 'Motor Pool & Fleet Depot Bay A',
    role: 'fleet',
    roleTitle: 'Delivery Fleet & Vehicle Logistics Lead',
    department: 'Delivery Fleet & Transportation',
    accessPermissions: ['GPS_ROUTE_DISPATCH', 'FUEL_CARD_AUDIT'],
    username: 'fleet_manager',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2023-06-10',
    salaryStructure: {
      basicSalary: 72000,
      hraAllowance: 28800,
      conveyanceAllowance: 6200,
      specialAllowance: 15000,
      grossSalary: 122000,
      esiDeduction: 0,
      pfDeduction: 8640,
      professionalTax: 500,
      totalDeductions: 9140,
      netSalary: 112860,
      bankName: 'Fifth Third Bank',
      accountNumber: '332019481920',
      ifscCode: 'FTBCUS33',
      panNumber: 'FLTAP011K',
      uanNumber: '100100100111',
      esiNumber: null,
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2023-06-10T09:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'cred-12',
    employeeId: 'APX-FLD-012',
    name: 'Liam O\'Connor',
    email: 'fieldservice@apexcorp.com',
    password: '1234',
    phone: '+1 (512) 890-4112',
    nationalId: 'US-TX-111029',
    address: 'Customer Field Engineering Center',
    role: 'field_service',
    roleTitle: 'Customer Care & Field Warranty Lead',
    department: 'Field Service & Customer Care',
    accessPermissions: ['RMA_TICKET_SIGN_OFF', 'WARRANTY_REPLACE'],
    username: 'service_lead',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2023-07-20',
    salaryStructure: {
      basicSalary: 78000,
      hraAllowance: 31200,
      conveyanceAllowance: 7000,
      specialAllowance: 16000,
      grossSalary: 132200,
      esiDeduction: 0,
      pfDeduction: 9360,
      professionalTax: 800,
      totalDeductions: 10160,
      netSalary: 122040,
      bankName: 'Capital One',
      accountNumber: '112019481920',
      ifscCode: 'NFBKUS33',
      panNumber: 'FLDAP012L',
      uanNumber: '100100100112',
      esiNumber: null,
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2023-07-20T09:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'cred-13',
    employeeId: 'APX-CRM-013',
    name: 'Rachel Green',
    email: 'crm@apexcorp.com',
    password: '1234',
    phone: '+1 (512) 890-4113',
    nationalId: 'US-TX-990129',
    address: 'Global Commercial & OEM Relations Floor',
    role: 'crm',
    roleTitle: 'Enterprise Sales & CRM Commercial Lead',
    department: 'Sales & Customer Relationship',
    accessPermissions: ['COMMERCIAL_CONTRACT_LOCK', 'LEAD_CONVERSION'],
    username: 'crm_lead',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2023-09-01',
    salaryStructure: {
      basicSalary: 92000,
      hraAllowance: 36800,
      conveyanceAllowance: 8000,
      specialAllowance: 20000,
      grossSalary: 156800,
      esiDeduction: 0,
      pfDeduction: 11040,
      professionalTax: 1000,
      totalDeductions: 12040,
      netSalary: 144760,
      bankName: 'TD Bank',
      accountNumber: '992019481920',
      ifscCode: 'TDOMUS33',
      panNumber: 'CRMAP013M',
      uanNumber: '100100100113',
      esiNumber: null,
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2023-09-01T09:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'cred-14',
    employeeId: 'APX-MKT-014',
    name: 'Sophia Taylor',
    email: 'marketing@apexcorp.com',
    password: '1234',
    phone: '+1 (512) 890-4114',
    nationalId: 'US-TX-880129',
    address: 'Commercial Marketing Studio',
    role: 'marketing',
    roleTitle: 'Marketing & Commercial Launch Lead',
    department: 'Marketing & Strategic Growth',
    accessPermissions: ['CAMPAIGN_BUDGET_DISBURSE', 'BRAND_ASSETS'],
    username: 'marketing_lead',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2023-11-15',
    salaryStructure: {
      basicSalary: 86000,
      hraAllowance: 34400,
      conveyanceAllowance: 7600,
      specialAllowance: 19000,
      grossSalary: 147000,
      esiDeduction: 0,
      pfDeduction: 10320,
      professionalTax: 1000,
      totalDeductions: 11320,
      netSalary: 135680,
      bankName: 'Truist Bank',
      accountNumber: '882019481921',
      ifscCode: 'SNVTUS33',
      panNumber: 'MKTAP014N',
      uanNumber: '100100100114',
      esiNumber: null,
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2023-11-15T09:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'cred-15',
    employeeId: 'APX-GATE-015',
    name: 'Vikram Singh',
    email: 'logistics@apexcorp.com',
    password: '1234',
    phone: '+1 (512) 890-4115',
    nationalId: 'US-TX-770129',
    address: 'Factory North Main Security Gatehouse',
    role: 'logistics_gate',
    roleTitle: 'Factory Gate Security & Inbound Logistics',
    department: 'Factory Gate & Inbound Security',
    accessPermissions: ['GATE_PASS_AUTHORIZE', 'TRUCK_SCALE_VERIFY'],
    username: 'security_gate',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2024-01-10',
    salaryStructure: {
      basicSalary: 48000,
      hraAllowance: 19200,
      conveyanceAllowance: 4800,
      specialAllowance: 8000,
      grossSalary: 80000,
      esiDeduction: 0,
      pfDeduction: 5760,
      professionalTax: 400,
      totalDeductions: 6160,
      netSalary: 73840,
      bankName: 'Frost Bank',
      accountNumber: '772019481921',
      ifscCode: 'FRSTUS44',
      panNumber: 'LOGAP015O',
      uanNumber: '100100100115',
      esiNumber: null,
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2024-01-10T09:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'cred-16',
    employeeId: 'APX-HR-016',
    name: 'Anita Roy',
    email: 'hr@apexcorp.com',
    password: '1234',
    phone: '+1 (512) 890-4116',
    nationalId: 'US-TX-660129',
    address: 'Human Resources & Workforce Desk',
    role: 'hr',
    roleTitle: 'Factory HR & Shift Roster Specialist',
    department: 'Human Resources & Payroll',
    accessPermissions: ['ONBOARD_STAFF', 'SHIFT_ROSTER_LOCK', 'LEAVE_APPROVE'],
    username: 'hr_lead',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2024-02-01',
    salaryStructure: {
      basicSalary: 78000,
      hraAllowance: 31200,
      conveyanceAllowance: 7000,
      specialAllowance: 16000,
      grossSalary: 132200,
      esiDeduction: 0,
      pfDeduction: 9360,
      professionalTax: 800,
      totalDeductions: 10160,
      netSalary: 122040,
      bankName: 'Huntington National Bank',
      accountNumber: '662019481921',
      ifscCode: 'HUNTUS33',
      panNumber: 'HRAP016P',
      uanNumber: '100100100116',
      esiNumber: null,
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2024-02-01T09:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'cred-17',
    employeeId: 'APX-IT-017',
    name: 'Gaurav Patil',
    email: 'admin@apexcorp.com',
    password: '1234',
    phone: '+1 (512) 890-4117',
    nationalId: 'US-TX-550129',
    address: 'Server Infrastructure & Factory IT Operations Center',
    role: 'system_admin',
    roleTitle: 'System Admin & IT Hardware Controller',
    department: 'Factory IT & Systems',
    accessPermissions: ['CREDENTIAL_VAULT_ADMIN', 'MFA_RESET', 'SERVER_ROLLBACK'],
    username: 'system_admin',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2024-03-01',
    salaryStructure: {
      basicSalary: 95000,
      hraAllowance: 38000,
      conveyanceAllowance: 8000,
      specialAllowance: 21000,
      grossSalary: 162000,
      esiDeduction: 0,
      pfDeduction: 11400,
      professionalTax: 1000,
      totalDeductions: 12400,
      netSalary: 149600,
      bankName: 'KeyBank',
      accountNumber: '552019481921',
      ifscCode: 'KEYBUS33',
      panNumber: 'ITAP017Q',
      uanNumber: '100100100117',
      esiNumber: null,
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2024-03-01T09:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'cred-18',
    employeeId: 'APX-TECH-018',
    name: 'Rameshwar Patil',
    email: 'rameshwar@apexcorp.com',
    password: '123',
    phone: '+91 98451 22334',
    nationalId: 'IN-KA-892102',
    address: 'Austin Advanced Manufacturing Campus, TX',
    role: 'production',
    roleTitle: 'SMT Line 1 Precision Assembly Lead',
    department: 'Precision Assembly Lines',
    accessPermissions: ['READ_WORK_ORDERS', 'LOG_ASSEMBLY_OUTPUT', 'VIEW_PARTS_RECIPE'],
    username: 'rameshwar_patil',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2024-03-15',
    salaryStructure: {
      basicSalary: 28000,
      hraAllowance: 11200,
      conveyanceAllowance: 2400,
      specialAllowance: 4400,
      grossSalary: 46000,
      esiDeduction: 0,
      pfDeduction: 3360,
      professionalTax: 300,
      totalDeductions: 3660,
      netSalary: 42340,
      bankName: 'State Bank of India',
      accountNumber: '381920194821',
      ifscCode: 'SBIN0004120',
      panNumber: 'ABCDE1234F',
      uanNumber: '101928374651',
      esiNumber: '5519283746',
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2024-03-15T09:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'cred-19',
    employeeId: 'APX-TECH-019',
    name: 'Priya Sharma',
    email: 'priya.sharma@apexcorp.com',
    password: '123',
    phone: '+91 91234 56789',
    nationalId: 'IN-KA-441203',
    address: 'Stuttgart EV Engineering Facility, Germany',
    role: 'quality',
    roleTitle: 'Precision Component Quality Inspector',
    department: 'Quality Assurance & Testing',
    accessPermissions: ['LOG_QC_INSPECTION', 'RAISE_DEFECT_REPORT', 'APPROVE_BATCH'],
    username: 'priya_sharma',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2024-06-01',
    salaryStructure: {
      basicSalary: 32000,
      hraAllowance: 12800,
      conveyanceAllowance: 2800,
      specialAllowance: 4400,
      grossSalary: 52000,
      esiDeduction: 0,
      pfDeduction: 3840,
      professionalTax: 300,
      totalDeductions: 4140,
      netSalary: 47860,
      bankName: 'HDFC Bank',
      accountNumber: '50100293847162',
      ifscCode: 'HDFC0001824',
      panNumber: 'FGHIJ5678K',
      uanNumber: '101928374652',
      esiNumber: '5519283747',
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2024-06-01T09:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'cred-20',
    employeeId: 'APX-TECH-020',
    name: 'Dilip Sawant',
    email: 'dilip.sawant@apexcorp.com',
    password: '123',
    phone: '+91 99887 76655',
    nationalId: 'IN-MH-551920',
    address: 'Austin Flagship Distribution Center, TX',
    role: 'warehouse',
    roleTitle: 'Senior Inventory & Material Logistics Specialist',
    department: 'Raw Materials & Inventory Control',
    accessPermissions: ['CYCLE_COUNT_LOG', 'BIN_MOVE_APPROVE', 'ISSUE_RAW_MAT'],
    username: 'dilip_sawant',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2024-01-10',
    salaryStructure: {
      basicSalary: 26000,
      hraAllowance: 10400,
      conveyanceAllowance: 2200,
      specialAllowance: 3400,
      grossSalary: 42000,
      esiDeduction: 0,
      pfDeduction: 3120,
      professionalTax: 300,
      totalDeductions: 3420,
      netSalary: 38580,
      bankName: 'ICICI Bank',
      accountNumber: '001205018293',
      ifscCode: 'ICIC0000012',
      panNumber: 'KLMNO9012P',
      uanNumber: '101928374653',
      esiNumber: '5519283748',
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2024-01-10T09:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'cred-21',
    employeeId: 'APX-TECH-021',
    name: 'Santosh Gowda',
    email: 'plant_operator@apexcorp.com',
    password: '123',
    phone: '+91 98765 43210',
    nationalId: 'IN-KA-772910',
    address: 'Jurong Cleanroom Facility, Singapore',
    role: 'plant_operator',
    roleTitle: 'Precision Assembly Operator',
    department: 'Precision Assembly Lines',
    accessPermissions: ['LOG_SHIFT_OUTPUT', 'STATION_CALL_MAINTENANCE'],
    username: 'plant_operator',
    isActive: true,
    status: 'ACTIVE',
    employmentType: 'FULL_TIME',
    dateOfJoining: '2024-05-15',
    salaryStructure: {
      basicSalary: 24000,
      hraAllowance: 9600,
      conveyanceAllowance: 2000,
      specialAllowance: 3000,
      grossSalary: 38600,
      esiDeduction: 0,
      pfDeduction: 2880,
      professionalTax: 250,
      totalDeductions: 3130,
      netSalary: 35470,
      bankName: 'Bank of Baroda',
      accountNumber: '2910010029384',
      ifscCode: 'BARB0BENGAL',
      panNumber: 'STHAP021G',
      uanNumber: '101928374654',
      esiNumber: '5519283749',
      paymentMode: 'DIRECT_BANK_TRANSFER',
    },
    createdAt: '2024-05-15T09:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
];

export default function EmployeeCredentialsPage() {
  const [staffList, setStaffList] = useState<EmployeeCredentialItem[]>(INITIAL_STAFF);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'ACTIVE' | 'TERMINATED'>('ALL');
  
  // Modals
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  
  // Active target for edit/view or termination
  const [activeStaff, setActiveStaff] = useState<EmployeeCredentialItem | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Edit Form State
  const [editForm, setEditForm] = useState({
    name: '',
    roleTitle: '',
    roleId: '',
    department: '',
    email: '',
    password: '',
    phone: '',
    nationalId: '',
    address: '',
    basicSalary: 0,
    hraAllowance: 0,
    conveyanceAllowance: 0,
    specialAllowance: 0,
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    panNumber: '',
    uanNumber: '',
    esiNumber: '',
  });

  // Termination Form State
  const [terminateReason, setTerminateReason] = useState('Performance Below Standard / Unsatisfactory');
  const [terminateNotes, setTerminateNotes] = useState('');
  const [terminateDate, setTerminateDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [revokeLoginAccess, setRevokeLoginAccess] = useState(true);

  // New Staff Onboarding Form State
  const [onboardForm, setOnboardForm] = useState({
    name: '',
    employeeId: `EMP-2026-0${100 + INITIAL_STAFF.length + 1}`,
    email: '',
    phone: '',
    nationalId: '',
    address: '',
    roleId: 'production',
    roleTitle: 'Precision Assembly Line Technician',
    department: 'Precision Assembly Lines',
    username: '',
    password: '123',
    employmentType: 'FULL_TIME',
    basicSalary: 25000,
    hraAllowance: 10000,
    conveyanceAllowance: 2000,
    specialAllowance: 3000,
    bankName: 'HDFC Bank',
    accountNumber: '',
    ifscCode: 'HDFC0001000',
    panNumber: '',
    uanNumber: '',
    esiNumber: '',
    paymentMode: 'DIRECT_BANK_TRANSFER',
  });

  // Load and synchronize with local storage & credential vault
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STAFF_STORAGE_KEY);
        let currentList = INITIAL_STAFF;
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            currentList = parsed;
          }
        }

        // Merge any newly registered users from vault
        const vaultUsers = userCredentialVault.getAllUsers();
        const existingEmails = new Set(currentList.map((s) => s.email.toLowerCase()));
        
        let hasNewFromVault = false;
        const mergedList = [...currentList];

        vaultUsers.forEach((vu) => {
          if (!existingEmails.has(vu.email.toLowerCase())) {
            hasNewFromVault = true;
            mergedList.push({
              id: `cred-${vu.id}`,
              employeeId: vu.employeeId,
              name: vu.name,
              email: vu.email,
              password: vu.passwordHash,
              phone: '+1 (512) 555-0199',
              address: vu.franchiseLocation,
              role: vu.roleId,
              roleTitle: vu.roleName,
              department: vu.department,
              accessPermissions: ['STANDARD_ROLE_ACCESS'],
              username: vu.username,
              isActive: vu.isActive,
              status: vu.isActive ? 'ACTIVE' : 'TERMINATED',
              employmentType: 'FULL_TIME',
              dateOfJoining: new Date().toISOString().split('T')[0],
              salaryStructure: {
                basicSalary: 30000,
                hraAllowance: 12000,
                conveyanceAllowance: 2400,
                specialAllowance: 3600,
                grossSalary: 48000,
                esiDeduction: 0,
                pfDeduction: 3600,
                professionalTax: 300,
                totalDeductions: 3900,
                netSalary: 44100,
                bankName: 'Corporate Treasury Wire',
                accountNumber: '99201948201',
                ifscCode: 'CORP0001',
                panNumber: 'CORP9920A',
                uanNumber: '100192837499',
                esiNumber: null,
                paymentMode: 'DIRECT_BANK_TRANSFER',
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        });

        setStaffList(mergedList);
        if (hasNewFromVault) {
          localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(mergedList));
        }
      } catch (e) {
        console.error('Error synchronizing master staff directory:', e);
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4500);
  };

  const togglePasswordVisibility = (id: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Open Full Editable Modal
  const openEditModal = (staff: EmployeeCredentialItem) => {
    setActiveStaff(staff);
    // Find live password from vault or staff record
    const vaultUser = userCredentialVault.getUserByEmail(staff.email);
    const livePassword = vaultUser ? vaultUser.passwordHash : (staff.password || '123');

    setEditForm({
      name: staff.name,
      roleTitle: staff.roleTitle,
      roleId: staff.role,
      department: staff.department,
      email: staff.email,
      password: livePassword,
      phone: staff.phone,
      nationalId: staff.nationalId || '',
      address: staff.address || '',
      basicSalary: staff.salaryStructure.basicSalary,
      hraAllowance: staff.salaryStructure.hraAllowance,
      conveyanceAllowance: staff.salaryStructure.conveyanceAllowance,
      specialAllowance: staff.salaryStructure.specialAllowance,
      bankName: staff.salaryStructure.bankName,
      accountNumber: staff.salaryStructure.accountNumber,
      ifscCode: staff.salaryStructure.ifscCode,
      panNumber: staff.salaryStructure.panNumber || '',
      uanNumber: staff.salaryStructure.uanNumber || '',
      esiNumber: staff.salaryStructure.esiNumber || '',
    });
    setIsEditModalOpen(true);
  };

  // Open Terminate / Fire Modal
  const openTerminateModal = (staff: EmployeeCredentialItem) => {
    setActiveStaff(staff);
    setTerminateReason('Performance Below Standard / Unsatisfactory');
    setTerminateNotes('');
    setTerminateDate(new Date().toISOString().split('T')[0]);
    setRevokeLoginAccess(true);
    setIsTerminateModalOpen(true);
  };

  // Execute Save of Edited Details
  const handleSaveEditedDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStaff) return;

    const basic = Number(editForm.basicSalary) || 0;
    const hra = Number(editForm.hraAllowance) || 0;
    const conveyance = Number(editForm.conveyanceAllowance) || 0;
    const special = Number(editForm.specialAllowance) || 0;
    const gross = basic + hra + conveyance + special;
    const pf = Math.round(basic * 0.12);
    const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0;
    const pt = 200;
    const totalDeductions = pf + esi + pt;
    const net = Math.max(0, gross - totalDeductions);

    const updatedStaff: EmployeeCredentialItem = {
      ...activeStaff,
      name: editForm.name,
      roleTitle: editForm.roleTitle,
      role: editForm.roleId,
      department: editForm.department,
      email: editForm.email.trim().toLowerCase(),
      password: editForm.password.trim(),
      phone: editForm.phone,
      nationalId: editForm.nationalId,
      address: editForm.address,
      updatedAt: new Date().toISOString(),
      salaryStructure: {
        ...activeStaff.salaryStructure,
        basicSalary: basic,
        hraAllowance: hra,
        conveyanceAllowance: conveyance,
        specialAllowance: special,
        grossSalary: gross,
        pfDeduction: pf,
        esiDeduction: esi,
        professionalTax: pt,
        totalDeductions: totalDeductions,
        netSalary: net,
        bankName: editForm.bankName,
        accountNumber: editForm.accountNumber,
        ifscCode: editForm.ifscCode,
        panNumber: editForm.panNumber,
        uanNumber: editForm.uanNumber,
        esiNumber: editForm.esiNumber,
      },
    };

    const updatedList = staffList.map((s) => (s.id === activeStaff.id ? updatedStaff : s));
    setStaffList(updatedList);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(updatedList));
    }

    // Synchronize to real system credential vault
    const vaultUser = userCredentialVault.getUserByEmail(activeStaff.email);
    if (vaultUser) {
      if (editForm.email.toLowerCase() !== activeStaff.email.toLowerCase()) {
        userCredentialVault.updateUserEmail(vaultUser.id, editForm.email);
      }
      if (editForm.password && editForm.password !== vaultUser.passwordHash) {
        userCredentialVault.updateUserPassword(vaultUser.id, editForm.password);
      }
    } else {
      userCredentialVault.registerUser({
        employeeId: updatedStaff.employeeId,
        name: updatedStaff.name,
        email: updatedStaff.email,
        password: editForm.password,
        roleId: updatedStaff.role,
        roleName: updatedStaff.roleTitle,
        department: updatedStaff.department,
      });
    }

    setIsEditModalOpen(false);
    showToast(`Updated master credentials, position, and payroll details for ${updatedStaff.name}.`);
  };

  // Execute Termination / Fire Action
  const handleExecuteTermination = () => {
    if (!activeStaff) return;

    const terminatedStaff: EmployeeCredentialItem = {
      ...activeStaff,
      isActive: false,
      status: 'TERMINATED',
      terminationDetails: {
        date: terminateDate,
        reason: terminateReason,
        notes: terminateNotes,
        terminatedBy: 'Super Admin / Managing Director',
      },
      updatedAt: new Date().toISOString(),
    };

    const updatedList = staffList.map((s) => (s.id === activeStaff.id ? terminatedStaff : s));
    setStaffList(updatedList);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(updatedList));
    }

    // Immediately revoke system login in credential vault
    const vaultUser = userCredentialVault.getUserByEmail(activeStaff.email);
    if (vaultUser) {
      userCredentialVault.toggleAccountStatus(vaultUser.id, false);
    }

    setIsTerminateModalOpen(false);
    showToast(`OFFICIAL ACTION: ${activeStaff.name} (${activeStaff.employeeId}) has been terminated. System login revoked.`);
  };

  // Reinstate / Rehire Employee
  const handleReinstateEmployee = (staff: EmployeeCredentialItem) => {
    const reinstatedStaff: EmployeeCredentialItem = {
      ...staff,
      isActive: true,
      status: 'ACTIVE',
      terminationDetails: undefined,
      updatedAt: new Date().toISOString(),
    };

    const updatedList = staffList.map((s) => (s.id === staff.id ? reinstatedStaff : s));
    setStaffList(updatedList);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(updatedList));
    }

    const vaultUser = userCredentialVault.getUserByEmail(staff.email);
    if (vaultUser) {
      userCredentialVault.toggleAccountStatus(vaultUser.id, true);
    }

    showToast(`REINSTATED: ${staff.name} is now active. Corporate credentials unlocked.`);
  };

  // New Employee Onboarding submission
  const handleCreateNewStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const basic = Number(onboardForm.basicSalary) || 0;
    const hra = Number(onboardForm.hraAllowance) || 0;
    const conveyance = Number(onboardForm.conveyanceAllowance) || 0;
    const special = Number(onboardForm.specialAllowance) || 0;
    const gross = basic + hra + conveyance + special;
    const pf = Math.round(basic * 0.12);
    const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0;
    const pt = 200;
    const totalDeductions = pf + esi + pt;
    const net = Math.max(0, gross - totalDeductions);

    const newStaff: EmployeeCredentialItem = {
      id: `cred-${Date.now()}`,
      employeeId: onboardForm.employeeId,
      name: onboardForm.name,
      email: onboardForm.email.trim().toLowerCase(),
      password: onboardForm.password.trim() || '123',
      phone: onboardForm.phone,
      nationalId: onboardForm.nationalId || 'XXXX-XXXX-9901',
      address: onboardForm.address || 'Flagship Manufacturing Plant',
      role: onboardForm.roleId,
      roleTitle: onboardForm.roleTitle,
      department: onboardForm.department,
      accessPermissions: ['STANDARD_ROLE_ACCESS'],
      username: onboardForm.username || onboardForm.email.split('@')[0],
      isActive: true,
      status: 'ACTIVE',
      employmentType: onboardForm.employmentType,
      dateOfJoining: new Date().toISOString().split('T')[0],
      salaryStructure: {
        basicSalary: basic,
        hraAllowance: hra,
        conveyanceAllowance: conveyance,
        specialAllowance: special,
        grossSalary: gross,
        esiDeduction: esi,
        pfDeduction: pf,
        professionalTax: pt,
        totalDeductions: totalDeductions,
        netSalary: net,
        bankName: onboardForm.bankName,
        accountNumber: onboardForm.accountNumber || '000000000000',
        ifscCode: onboardForm.ifscCode,
        panNumber: onboardForm.panNumber || 'ABCDE1234F',
        uanNumber: onboardForm.uanNumber || '101928374999',
        esiNumber: onboardForm.esiNumber || null,
        paymentMode: onboardForm.paymentMode,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [newStaff, ...staffList];
    setStaffList(updatedList);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(updatedList));
    }

    // Register user in the credential vault for immediate login
    userCredentialVault.registerUser({
      employeeId: newStaff.employeeId,
      name: newStaff.name,
      email: newStaff.email,
      username: newStaff.username,
      password: newStaff.password,
      roleId: newStaff.role,
      roleName: newStaff.roleTitle,
      department: newStaff.department,
    });

    setIsOnboardingModalOpen(false);
    showToast(`Staff member [${newStaff.name} - ${newStaff.employeeId}] onboarded with password registered in Vault.`);
  };

  // Generate random strong password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let p = '';
    for (let i = 0; i < 9; i++) {
      p += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setEditForm((prev) => ({ ...prev, password: p }));
  };

  // Filter staff directory
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        s.name.toLowerCase().includes(q) ||
        s.employeeId.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.roleTitle.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q);

      const matchesDept = selectedDeptFilter === 'ALL' || s.department === selectedDeptFilter;
      const matchesStatus =
        selectedStatusFilter === 'ALL' ||
        (selectedStatusFilter === 'ACTIVE' && s.status !== 'TERMINATED' && s.isActive) ||
        (selectedStatusFilter === 'TERMINATED' && (s.status === 'TERMINATED' || !s.isActive));

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [staffList, searchQuery, selectedDeptFilter, selectedStatusFilter]);

  // Aggregate Metrics
  const activeCount = staffList.filter((s) => s.status !== 'TERMINATED' && s.isActive).length;
  const terminatedCount = staffList.length - activeCount;
  const totalMonthlyGross = staffList
    .filter((s) => s.isActive && s.status !== 'TERMINATED')
    .reduce((acc, s) => acc + s.salaryStructure.grossSalary, 0);
  const totalMonthlyPf = staffList
    .filter((s) => s.isActive && s.status !== 'TERMINATED')
    .reduce((acc, s) => acc + s.salaryStructure.pfDeduction, 0);
  const totalMonthlyNet = staffList
    .filter((s) => s.isActive && s.status !== 'TERMINATED')
    .reduce((acc, s) => acc + s.salaryStructure.netSalary, 0);

  const departmentsList = useMemo(() => {
    const set = new Set(staffList.map((s) => s.department));
    return Array.from(set);
  }, [staffList]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white text-xs font-semibold rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Console Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Master Enterprise Personnel & Credential Vault</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Employee Directory, Positions & Password Manager
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Live editable directory of all corporate roles, designated positions, verified corporate email addresses, login passwords, statutory compensation, and official termination management.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/system-admin/users"
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Security Vault Audit</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsOnboardingModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>Hire & Onboard Employee</span>
          </button>
        </div>
      </div>

      {/* 4 Core Summary Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Corporate Headcount</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {staffList.length} Total Positions
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{activeCount} Active</span>
              &bull;
              <span className="text-rose-600 dark:text-rose-400 font-semibold">{terminatedCount} Terminated</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Monthly Gross Liability</span>
            <span className="h-2 w-2 rounded-full bg-blue-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
              ₹ {(totalMonthlyGross / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Basic + HRA + Special Allowances
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Statutory PF (12%) Pool</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
              ₹ {totalMonthlyPf.toLocaleString()} / mo
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Monthly compliance contribution
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Net Monthly Disbursal</span>
            <span className="h-2 w-2 rounded-full bg-purple-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 tracking-tight font-mono">
              ₹ {(totalMonthlyNet / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Direct net take-home bank total
            </div>
          </div>
        </div>
      </div>

      {/* Main Employee & Position Directory Table */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        {/* Table Filter & Search Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Corporate Staff Master Directory ({filteredStaff.length} Employees)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Editable profiles, positions, emails, passwords, salaries, and termination statuses
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff, position, email, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-64 font-medium"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="ALL">All Departments ({departmentsList.length})</option>
              {departmentsList.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Employment Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="ALL">All Statuses ({staffList.length})</option>
              <option value="ACTIVE">Active Staff ({activeCount})</option>
              <option value="TERMINATED">Terminated / Fired ({terminatedCount})</option>
            </select>
          </div>
        </div>

        {/* Master Directory Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-950/70">
                <th className="py-3 px-3.5">Employee Name & ID</th>
                <th className="py-3 px-3.5">Assigned Position & Department</th>
                <th className="py-3 px-3.5">Corporate Email & Password</th>
                <th className="py-3 px-3.5">Compensation (Gross / Net)</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5 text-right">Actions & Governance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredStaff.map((staff) => {
                const isTerminated = staff.status === 'TERMINATED' || !staff.isActive;
                const isRevealed = !!revealedPasswords[staff.id];
                const liveVaultUser = userCredentialVault.getUserByEmail(staff.email);
                const currentPassword = liveVaultUser ? liveVaultUser.passwordHash : (staff.password || '123');

                return (
                  <tr
                    key={staff.id}
                    className={`transition-colors ${
                      isTerminated
                        ? 'bg-rose-50/30 dark:bg-rose-950/10 hover:bg-rose-50/50'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/20'
                    }`}
                  >
                    {/* 1. Employee Name & ID */}
                    <td className="py-3.5 px-3.5">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{staff.name}</span>
                        {isTerminated && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-semibold uppercase">
                            Terminated
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        {staff.employeeId} &bull; {staff.phone}
                      </div>
                    </td>

                    {/* 2. Position & Department */}
                    <td className="py-3.5 px-3.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {staff.roleTitle}
                      </div>
                      <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                        {staff.department}
                      </div>
                    </td>

                    {/* 3. Corporate Email & Password */}
                    <td className="py-3.5 px-3.5 font-mono">
                      <div className="text-slate-900 dark:text-slate-100 font-semibold text-[11px] flex items-center gap-1">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <span>{staff.email}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400">Pass:</span>
                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          {isRevealed ? currentPassword : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(staff.id)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                          title={isRevealed ? 'Hide Password' : 'Show Password'}
                        >
                          {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </td>

                    {/* 4. Salary */}
                    <td className="py-3.5 px-3.5 font-mono">
                      <div className="font-bold text-slate-900 dark:text-white text-xs">
                        ₹ {staff.salaryStructure.grossSalary.toLocaleString()}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">Gross</span>
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                        ₹ {staff.salaryStructure.netSalary.toLocaleString()} Net / mo
                      </div>
                    </td>

                    {/* 5. Status */}
                    <td className="py-3.5 px-3.5">
                      {isTerminated ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
                            <UserX className="h-2.5 w-2.5" /> Terminated
                          </span>
                          {staff.terminationDetails && (
                            <div className="text-[9px] text-slate-400">
                              {staff.terminationDetails.date}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                          <Check className="h-2.5 w-2.5" /> Active Staff
                        </span>
                      )}
                    </td>

                    {/* 6. Actions: Edit + Terminate / Reinstate */}
                    <td className="py-3.5 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(staff)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
                        >
                          Edit Details
                        </button>

                        {isTerminated ? (
                          <button
                            type="button"
                            onClick={() => handleReinstateEmployee(staff)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 transition flex items-center gap-1"
                            title="Reinstate employment and restore system credentials"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Rehire</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openTerminateModal(staff)}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-400 text-xs font-semibold border border-rose-200 dark:border-rose-800 transition flex items-center gap-1"
                            title="Officially terminate employee and revoke credentials"
                          >
                            <UserX className="h-3 w-3" />
                            <span>Fire / Terminate</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: FULL EDITABLE EMPLOYEE DETAILS, POSITION & CREDENTIALS MODAL */}
      {/* ========================================================================= */}
      {isEditModalOpen && activeStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  Edit Employee Profile & Corporate Credentials
                </h3>
                <p className="text-xs text-slate-500">
                  {activeStaff.name} &bull; <span className="font-mono">{activeStaff.employeeId}</span>
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedDetails} className="space-y-4 text-xs">
              {/* Section 1: Position & Basic Details */}
              <div className="space-y-2">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider block text-[11px]">
                  1. Official Position & Identity
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Designation / Position Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.roleTitle}
                      onChange={(e) => setEditForm({ ...editForm, roleTitle: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Role Category *
                    </label>
                    <select
                      value={editForm.roleId}
                      onChange={(e) => {
                        const r = ALL_ROLES.find((item) => item.id === e.target.value);
                        setEditForm({
                          ...editForm,
                          roleId: e.target.value,
                          department: r ? r.department : editForm.department,
                        });
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    >
                      {ALL_ROLES.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} [{r.department}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Assigned Department *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.department}
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      National Identity / SSN
                    </label>
                    <input
                      type="text"
                      value={editForm.nationalId}
                      onChange={(e) => setEditForm({ ...editForm, nationalId: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Corporate Email & Password */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider block text-[11px]">
                  2. Corporate Sign-In Credentials (Vault Synchronized)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Corporate Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-medium text-slate-700 dark:text-slate-300">
                        Corporate Password *
                      </label>
                      <button
                        type="button"
                        onClick={generateRandomPassword}
                        className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <RefreshCw className="h-2.5 w-2.5" /> Generate Random
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={editForm.password}
                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Salary & Compensation */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider block text-[11px]">
                  3. Monthly Salary Breakdown (₹)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Basic Salary
                    </label>
                    <input
                      type="number"
                      required
                      value={editForm.basicSalary}
                      onChange={(e) => setEditForm({ ...editForm, basicSalary: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      HRA Allowance
                    </label>
                    <input
                      type="number"
                      value={editForm.hraAllowance}
                      onChange={(e) => setEditForm({ ...editForm, hraAllowance: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Conveyance
                    </label>
                    <input
                      type="number"
                      value={editForm.conveyanceAllowance}
                      onChange={(e) => setEditForm({ ...editForm, conveyanceAllowance: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Special Allowance
                    </label>
                    <input
                      type="number"
                      value={editForm.specialAllowance}
                      onChange={(e) => setEditForm({ ...editForm, specialAllowance: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Bank Details */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider block text-[11px]">
                  4. Bank Account & Statutory Numbers
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={editForm.bankName}
                      onChange={(e) => setEditForm({ ...editForm, bankName: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={editForm.accountNumber}
                      onChange={(e) => setEditForm({ ...editForm, accountNumber: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      IFSC / SWIFT Code
                    </label>
                    <input
                      type="text"
                      value={editForm.ifscCode}
                      onChange={(e) => setEditForm({ ...editForm, ifscCode: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-mono uppercase text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  Save Changes & Sync Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: OFFICIAL TERMINATE / FIRE EMPLOYEE DIALOG */}
      {/* ========================================================================= */}
      {isTerminateModalOpen && activeStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400">
                <UserX className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Terminate / Fire Employee
                </h3>
                <p className="text-xs text-slate-500">
                  Official Human Resources Separation Action
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 space-y-1">
              <div>
                Target: <strong className="font-bold">{activeStaff.name}</strong> ({activeStaff.employeeId})
              </div>
              <div>Position: {activeStaff.roleTitle}</div>
              <div>Email: <span className="font-mono">{activeStaff.email}</span></div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Termination Reason *
                </label>
                <select
                  value={terminateReason}
                  onChange={(e) => setTerminateReason(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500 font-medium"
                >
                  <option value="Performance Below Standard / Unsatisfactory">Performance Below Standard / Unsatisfactory</option>
                  <option value="Gross Policy Misconduct / Breach of Trust">Gross Policy Misconduct / Breach of Trust</option>
                  <option value="Redundancy / Structural Downsizing">Redundancy / Structural Downsizing</option>
                  <option value="Contract Completion / Non-Renewal">Contract Completion / Non-Renewal</option>
                  <option value="Voluntary Resignation Accepted">Voluntary Resignation Accepted</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Effective Separation Date *
                </label>
                <input
                  type="date"
                  value={terminateDate}
                  onChange={(e) => setTerminateDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  HR Separation Documentation Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter details of exit interview, severance package, or justification notes..."
                  value={terminateNotes}
                  onChange={(e) => setTerminateNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  id="revokeLogin"
                  checked={revokeLoginAccess}
                  onChange={(e) => setRevokeLoginAccess(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="revokeLogin" className="text-[11px] text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                  Immediately revoke corporate email & system login credentials in Vault
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsTerminateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteTermination}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <UserX className="h-4 w-4" />
                <span>Confirm Immediate Termination</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ONBOARD NEW STAFF FORM */}
      {/* ========================================================================= */}
      {isOnboardingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-blue-600" />
                  Hire & Onboard New Staff Member
                </h3>
                <p className="text-xs text-slate-500">
                  Assign corporate role, set login credentials, and configure salary structure
                </p>
              </div>
              <button
                onClick={() => setIsOnboardingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewStaff} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Smith"
                    value={onboardForm.name}
                    onChange={(e) => setOnboardForm({ ...onboardForm, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. dsmith@apexcorp.com"
                    value={onboardForm.email}
                    onChange={(e) => setOnboardForm({ ...onboardForm, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Initial Password *
                  </label>
                  <input
                    type="text"
                    required
                    value={onboardForm.password}
                    onChange={(e) => setOnboardForm({ ...onboardForm, password: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Assign Role (From 21 Corporate Roles) *
                  </label>
                  <select
                    value={onboardForm.roleId}
                    onChange={(e) => {
                      const r = ALL_ROLES.find((item) => item.id === e.target.value);
                      setOnboardForm({
                        ...onboardForm,
                        roleId: e.target.value,
                        roleTitle: r ? `${r.name} Lead` : onboardForm.roleTitle,
                        department: r ? r.department : onboardForm.department,
                      });
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    {ALL_ROLES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} [{r.department}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Designation / Position Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={onboardForm.roleTitle}
                    onChange={(e) => setOnboardForm({ ...onboardForm, roleTitle: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={onboardForm.department}
                    onChange={(e) => setOnboardForm({ ...onboardForm, department: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOnboardingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                >
                  <UserPlus className="h-4 w-4" />
                  Save & Onboard Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
