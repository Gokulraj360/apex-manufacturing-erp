'use client';

import React, { useState } from 'react';
import {
  Factory,
  FileText,
  Truck,
  Receipt,
  Award,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ExternalLink,
  Download,
  Calendar,
  Building2,
  ShieldCheck,
  Package,
  TrendingUp,
  XCircle,
  QrCode,
  DollarSign,
  ChevronRight,
  Send,
  X,
} from 'lucide-react';
import { generateAndDownloadWordDoc } from '@/lib/wordDocumentGenerator';

interface RFQItem {
  id: string;
  rfqNumber: string;
  partName: string;
  partNumber: string;
  targetQuantity: number;
  deliveryDueDate: string;
  targetPriceRange: string;
  technicalSpecsUrl: string;
  status: 'OPEN_FOR_BID' | 'BID_SUBMITTED' | 'CLOSED_AWARDED';
  submittedBid?: {
    unitRate: number;
    leadTimeDays: number;
    toolingNre: number;
    validityDate: string;
  };
}

interface SupplierPOItem {
  id: string;
  poNumber: string;
  orderDate: string;
  promisedDate: string;
  lineItemsCount: number;
  totalValue: number;
  currency: string;
  status: 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'DISPATCH_IN_PROGRESS' | 'FULFILLED';
  specificationDoc: string;
}

interface ASNItem {
  id: string;
  asnNumber: string;
  poReference: string;
  vehicleNumber: string;
  transporterName: string;
  driverName: string;
  driverPhone: string;
  dispatchTimestamp: string;
  estimatedArrival: string;
  totalCartons: number;
  grossWeightKg: number;
  containerSealNumber: string;
  status: 'IN_TRANSIT' | 'ARRIVED_WEIGHBRIDGE' | 'UNLOADED_ACCEPTED' | 'QC_QUARANTINE';
}

interface SupplierInvoiceItem {
  id: string;
  invoiceNumber: string;
  poNumber: string;
  asnNumber: string;
  invoiceDate: string;
  amount: number;
  taxAmount: number;
  currency: string;
  matchingStatus: 'MATCHED_APPROVED' | 'HELD_PRICE_VARIANCE' | 'PENDING_GRN_VERIFICATION' | 'PAID';
  varianceAmount?: number;
}

const MOCK_RFQS: RFQItem[] = [
  {
    id: 'rfq-1',
    rfqNumber: 'RFQ-SCM-2026-0044',
    partName: 'CNC Aerospace Titanium Camera Bezel Ring',
    partNumber: 'APX-CAM-BZ-902',
    targetQuantity: 25000,
    deliveryDueDate: '2026-11-15',
    targetPriceRange: '$3.80 - $4.10 / pc',
    technicalSpecsUrl: '/docs/spec-cam-902.pdf',
    status: 'OPEN_FOR_BID',
  },
  {
    id: 'rfq-2',
    rfqNumber: 'RFQ-SCM-2026-0042',
    partName: 'Ultra-Thin Flexible Industrial FPC Sensor Cable',
    partNumber: 'FPC-DISP-FLX-011',
    targetQuantity: 50000,
    deliveryDueDate: '2026-11-01',
    targetPriceRange: '$1.45 - $1.60 / pc',
    technicalSpecsUrl: '/docs/spec-fpc-011.pdf',
    status: 'BID_SUBMITTED',
    submittedBid: {
      unitRate: 1.48,
      leadTimeDays: 14,
      toolingNre: 1200,
      validityDate: '2026-11-30',
    },
  },
  {
    id: 'rfq-3',
    rfqNumber: 'RFQ-SCM-2026-0039',
    partName: 'Shielded Ceramic Capacitor Array 0402',
    partNumber: 'CAP-ARRAY-0402-K',
    targetQuantity: 100000,
    deliveryDueDate: '2026-10-28',
    targetPriceRange: '$0.042 / pc',
    technicalSpecsUrl: '/docs/spec-cap-0402.pdf',
    status: 'CLOSED_AWARDED',
  },
];

const MOCK_POS: SupplierPOItem[] = [
  {
    id: 'po-1',
    poNumber: 'PO-APEX-2026-0891',
    orderDate: '2026-10-18',
    promisedDate: '2026-10-27',
    lineItemsCount: 4,
    totalValue: 84500,
    currency: 'USD',
    status: 'CONFIRMED',
    specificationDoc: 'PO-0891-Spec-Rev3.pdf',
  },
  {
    id: 'po-2',
    poNumber: 'PO-APEX-2026-0899',
    orderDate: '2026-10-20',
    promisedDate: '2026-11-04',
    lineItemsCount: 2,
    totalValue: 42300,
    currency: 'USD',
    status: 'PENDING_CONFIRMATION',
    specificationDoc: 'PO-0899-Spec-Rev1.pdf',
  },
  {
    id: 'po-3',
    poNumber: 'PO-APEX-2026-0870',
    orderDate: '2026-10-05',
    promisedDate: '2026-10-15',
    lineItemsCount: 6,
    totalValue: 129000,
    currency: 'USD',
    status: 'FULFILLED',
    specificationDoc: 'PO-0870-Spec-Final.pdf',
  },
];

const MOCK_ASNS: ASNItem[] = [
  {
    id: 'asn-1',
    asnNumber: 'ASN-VEN-2026-0182',
    poReference: 'PO-APEX-2026-0891',
    vehicleNumber: 'MH-12-RN-8821',
    transporterName: 'Vanguard Freight Logistics',
    driverName: 'Vikram Rajput',
    driverPhone: '+91 98230 11223',
    dispatchTimestamp: '2026-10-22 06:30',
    estimatedArrival: '2026-10-22 14:00',
    totalCartons: 85,
    grossWeightKg: 1420.5,
    containerSealNumber: 'SEAL-SEC-99014',
    status: 'IN_TRANSIT',
  },
  {
    id: 'asn-2',
    asnNumber: 'ASN-VEN-2026-0178',
    poReference: 'PO-APEX-2026-0870',
    vehicleNumber: 'KA-04-AK-5509',
    transporterName: 'Express Blue Haulage',
    driverName: 'Ramesh Patel',
    driverPhone: '+91 97412 88901',
    dispatchTimestamp: '2026-10-14 09:00',
    estimatedArrival: '2026-10-15 11:30',
    totalCartons: 120,
    grossWeightKg: 2150.0,
    containerSealNumber: 'SEAL-SEC-98441',
    status: 'UNLOADED_ACCEPTED',
  },
];

const MOCK_INVOICES: SupplierInvoiceItem[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-VEN-2026-0941',
    poNumber: 'PO-APEX-2026-0891',
    asnNumber: 'ASN-VEN-2026-0182',
    invoiceDate: '2026-10-22',
    amount: 84500,
    taxAmount: 15210,
    currency: 'USD',
    matchingStatus: 'PENDING_GRN_VERIFICATION',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-VEN-2026-0888',
    poNumber: 'PO-APEX-2026-0870',
    asnNumber: 'ASN-VEN-2026-0178',
    invoiceDate: '2026-10-15',
    amount: 129000,
    taxAmount: 23220,
    currency: 'USD',
    matchingStatus: 'MATCHED_APPROVED',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-VEN-2026-0812',
    poNumber: 'PO-APEX-2026-0850',
    asnNumber: 'ASN-VEN-2026-0155',
    invoiceDate: '2026-09-28',
    amount: 34200,
    taxAmount: 6156,
    currency: 'USD',
    matchingStatus: 'PAID',
  },
];

export default function SupplierPortalPage() {
  const [activeTab, setActiveTab] = useState<'rfqs' | 'orders' | 'asn' | 'invoices' | 'scorecard'>('orders');
  const [rfqs, setRfqs] = useState<RFQItem[]>(MOCK_RFQS);
  const [pos, setPos] = useState<SupplierPOItem[]>(MOCK_POS);
  const [asns, setAsns] = useState<ASNItem[]>(MOCK_ASNS);
  const [invoices] = useState<SupplierInvoiceItem[]>(MOCK_INVOICES);

  // New Bid Modal state
  const [selectedRfq, setSelectedRfq] = useState<RFQItem | null>(null);
  const [bidRate, setBidRate] = useState('');
  const [bidLeadTime, setBidLeadTime] = useState('14');
  const [bidNre, setBidNre] = useState('0');

  // New ASN Modal state
  const [isAsnModalOpen, setIsAsnModalOpen] = useState(false);
  const [newAsnPo, setNewAsnPo] = useState('PO-APEX-2026-0891');
  const [newAsnTruck, setNewAsnTruck] = useState('');
  const [newAsnTransporter, setNewAsnTransporter] = useState('Vanguard Freight Logistics');
  const [newAsnDriver, setNewAsnDriver] = useState('');
  const [newAsnPhone, setNewAsnPhone] = useState('');
  const [newAsnCartons, setNewAsnCartons] = useState('50');
  const [newAsnWeight, setNewAsnWeight] = useState('850');
  const [newAsnEta, setNewAsnEta] = useState('2026-10-23 15:00');

  const handleConfirmPo = (id: string) => {
    setPos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'CONFIRMED' } : item))
    );
  };

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRfq) return;
    setRfqs((prev) =>
      prev.map((r) =>
        r.id === selectedRfq.id
          ? {
              ...r,
              status: 'BID_SUBMITTED',
              submittedBid: {
                unitRate: parseFloat(bidRate) || 3.95,
                leadTimeDays: parseInt(bidLeadTime) || 14,
                toolingNre: parseFloat(bidNre) || 0,
                validityDate: '2026-11-30',
              },
            }
          : r
      )
    );
    setSelectedRfq(null);
  };

  const handleCreateAsn = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: ASNItem = {
      id: `asn-${Date.now()}`,
      asnNumber: `ASN-VEN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      poReference: newAsnPo,
      vehicleNumber: newAsnTruck || 'MH-14-EA-9912',
      transporterName: newAsnTransporter,
      driverName: newAsnDriver || 'Anand Shinde',
      driverPhone: newAsnPhone || '+91 98810 54321',
      dispatchTimestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      estimatedArrival: newAsnEta,
      totalCartons: parseInt(newAsnCartons) || 40,
      grossWeightKg: parseFloat(newAsnWeight) || 620,
      containerSealNumber: `SEAL-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'IN_TRANSIT',
    };
    setAsns([newEntry, ...asns]);
    setIsAsnModalOpen(false);
  };

  const handleDownloadPoSpecsDoc = (po: SupplierPOItem) => {
    generateAndDownloadWordDoc(`Apex_PO_Spec_Dossier_${po.poNumber}`, {
      title: 'PURCHASE ORDER CONTRACT & TECHNICAL MANUFACTURING SPECIFICATIONS',
      documentRef: `${po.poNumber}-SPEC-REV4`,
      classification: 'OFFICIAL PROCUREMENT ORDER // PROPRIETARY SPECIFICATIONS',
      department: 'Global Supply Chain & Procurement Engineering',
      author: 'David O\'Connor, Global SCM Sourcing Lead',
      summary: `Official purchase contract and manufacturing execution specification for Purchase Order ${po.poNumber} issued to Precision Component Technologies Ltd. Defines dimensional tolerances (±0.005mm), raw material certifications (Aerospace Titanium Grade 5 Ti-6Al-4V), cleanroom packaging protocols, and strict delivery milestone dates.`,
      sections: [
        {
          heading: '1. Purchase Order Commercial Scope & Milestone Commitments',
          content: [
            `This contractual release authorizes Precision Component Technologies Ltd to procure approved raw stock, commence precision CNC fabrication, and schedule inbound logistics under Apex Master Procurement Agreement (MPA-2026-088).`,
            `Total contract commitment is valued at $${po.totalValue.toLocaleString()} USD across ${po.lineItemsCount} production line items.`
          ],
          table: {
            headers: ['Line Item', 'Part Description & Number', 'Ordered Quantity', 'Unit Price (USD)', 'Extended Amount', 'Required Delivery Date'],
            rows: [
              ['Item 01', 'CNC Titanium Camera Bezel Ring (APX-CAM-BZ-902)', '10,000 pcs', '$3.95', '$39,500.00', po.promisedDate],
              ['Item 02', 'High-Purity Sapphire Lens Cover Ring (APX-SPH-088)', '5,000 pcs', '$4.50', '$22,500.00', po.promisedDate],
              ['Item 03', 'Aerospace O-Ring Fluorosilicone Gasket (GSK-AER-441)', '15,000 pcs', '$1.50', '$22,500.00', po.promisedDate]
            ]
          }
        },
        {
          heading: '2. Engineering Tolerances & Quality Inspection Criteria',
          content: [
            'All lots must comply with Critical-to-Quality (CTQ) dimensional parameters verified via calibrated Coordinate Measuring Machines (CMM).',
            'Surface roughness (Ra) must not exceed 0.2 µm. Submissions require raw material mill test reports and Certificate of Conformance (CoC).'
          ],
          table: {
            headers: ['Characteristic', 'Engineering Nominal', 'Lower Spec Limit (LSL)', 'Upper Spec Limit (USL)', 'Cpk Minimum Threshold'],
            rows: [
              ['Outer Ring Diameter', '24.500 mm', '24.495 mm', '24.505 mm', '≥ 1.67 Cpk'],
              ['Wall Thickness', '0.800 mm', '0.790 mm', '0.810 mm', '≥ 1.50 Cpk'],
              ['Hardness (Rockwell C)', '36.0 HRC', '34.0 HRC', '38.0 HRC', '≥ 1.67 Cpk'],
              ['Helium Leak Rate', '< 1.0e-8 mbar·L/s', '0.0', '1.0e-8', '100% Hermetic Test']
            ]
          },
          callout: {
            title: 'Critical Delivery Clause',
            text: 'Failure to furnish Advance Shipping Notice (ASN) prior to factory gate arrival will result in weighbridge quarantine and automated demurrage assessment.',
            type: 'warning'
          }
        },
        {
          heading: '3. Technical CAD Orthographic Drawing & CMM Metrology Data Table',
          subheading: 'ASME Y14.5M Geometric Dimensioning & Tolerancing (GD&T) Inspection Standards',
          cadBlueprint: {
            drawingNumber: `DWG-${po.poNumber}-REV4`,
            revision: '4.1',
            partName: 'CNC Titanium Camera Bezel Ring (APX-CAM-BZ-902)',
            material: 'Titanium Grade 5 (Ti-6Al-4V) Annealed Bar Stock',
            surfaceFinish: 'Ra 0.2 µm Diamond Lapped',
            units: 'MILLIMETERS [mm]',
            scale: '1:1',
            gdtCallouts: [
              {
                symbol: '⌖',
                tolerance: '⌀ 0.005 Ⓜ',
                datumRefs: 'A | B | C',
                description: 'Lens mounting bore true position with Maximum Material Condition',
              },
              {
                symbol: '⌓',
                tolerance: '0.002 mm',
                datumRefs: 'A',
                description: 'Optic seat seating plane profile and flatness',
              },
              {
                symbol: '⟂',
                tolerance: '0.003 mm',
                datumRefs: 'A',
                description: 'Outer bezel perimeter perpendicularity to base datum',
              },
            ],
            dimensions: [
              {
                featureId: 'BEZEL-01',
                featureDescription: 'Outer Ring Diameter (CMM 360-pt Scan)',
                nominalMm: 24.500,
                toleranceMm: '±0.005 mm',
                uslMm: 24.505,
                lslMm: 24.495,
                measuredMm: 24.501,
                deviationMm: '+0.001',
                inspectionMethod: 'Zeiss Prismo CMM High-Speed Scanning Probe',
                status: 'CONFORMING',
              },
              {
                featureId: 'BEZEL-02',
                featureDescription: 'Internal Optic Aperture Bore Diameter',
                nominalMm: 18.200,
                toleranceMm: '±0.004 mm',
                uslMm: 18.204,
                lslMm: 18.196,
                measuredMm: 18.201,
                deviationMm: '+0.001',
                inspectionMethod: 'Air Gage Metrology Mandrel',
                status: 'CONFORMING',
              },
              {
                featureId: 'BEZEL-03',
                featureDescription: 'Wall Thickness Cross-Section',
                nominalMm: 0.800,
                toleranceMm: '±0.010 mm',
                uslMm: 0.810,
                lslMm: 0.790,
                measuredMm: 0.802,
                deviationMm: '+0.002',
                inspectionMethod: 'Optical Non-Contact Laser Thickness Gage',
                status: 'CONFORMING',
              },
              {
                featureId: 'BEZEL-04',
                featureDescription: 'Substrate Hardness (Rockwell C)',
                nominalMm: 36.0,
                toleranceMm: '±2.0 HRC',
                uslMm: 38.0,
                lslMm: 34.0,
                measuredMm: 36.5,
                deviationMm: '+0.5',
                inspectionMethod: 'Wilson Rockwell Hardness Tester',
                status: 'CRITICAL_PASS',
              },
            ],
          },
        }
      ],
      signatories: [
        {
          name: 'David O\'Connor',
          role: 'Director of Global Procurement',
          organization: 'Apex Industrial Technologies Inc.',
          signatureDate: '2026-10-22'
        },
        {
          name: 'Dr. Marcus Reyes',
          role: 'VP of Hardware Engineering & Tolerancing',
          organization: 'Apex Industrial Technologies Inc.',
          signatureDate: '2026-10-22'
        },
        {
          name: 'Vikram Rajput',
          role: 'Authorized Vendor Managing Director',
          organization: 'Precision Component Technologies Ltd',
          signatureDate: '2026-10-22'
        }
      ]
    });
  };

  const handleDownloadAsnManifestDoc = (asn: ASNItem) => {
    generateAndDownloadWordDoc(`Apex_ASN_Freight_Manifest_${asn.asnNumber}`, {
      title: 'ADVANCE SHIPPING NOTICE (ASN) & INBOUND FREIGHT MANIFEST',
      documentRef: asn.asnNumber,
      classification: 'OFFICIAL INBOUND LOGISTICS & WEIGHBRIDGE PASS',
      department: 'Logistics, Gate Clearance & Receiving Operations',
      author: 'Vikram Rajput, Logistics Dispatch Controller',
      summary: `Official Advance Shipping Notice (ASN) and Electronic Consignment Manifest for Inbound Freight Shipment ${asn.asnNumber} bound for Apex North Gate Weighbridge. Provides verified vehicle registration, tamper-evident security seal numbers, gross weight declarations, and container pallet inventory.`,
      sections: [
        {
          heading: '1. Transport & Vehicle Security Verification',
          content: [
            `The consignment described herein is dispatched under direct electronic tracking and must be processed immediately through Gate Weighbridge Scale 2 upon arrival at the Apex Manufacturing Complex.`,
            `Tamper-evident container seal integrity must be verified by factory security before unloading into receiving staging bay.`
          ],
          table: {
            headers: ['Carrier / Transporter', 'Vehicle Registration', 'Assigned Driver', 'Driver Mobile', 'Tamper Security Seal #', 'Gross Freight Weight'],
            rows: [
              [asn.transporterName, asn.vehicleNumber, asn.driverName, asn.driverPhone, asn.containerSealNumber, `${asn.grossWeightKg} kg (${asn.totalCartons} Cartons)`]
            ]
          }
        },
        {
          heading: '2. Consignment Cargo Manifest & Associated Purchase Orders',
          content: [
            'Each pallet has been scanned and cross-referenced with production line kit allocations.'
          ],
          table: {
            headers: ['Pallet / Container ID', 'PO Reference', 'Part Description', 'Quantity Packed', 'Gross Weight', 'Storage Condition'],
            rows: [
              ['PLT-2026-001', asn.poReference, 'CNC Camera Bezel Rings (Lot #B492)', '5,000 units', '450.0 kg', 'Ambient Clean / Anti-Static'],
              ['PLT-2026-002', asn.poReference, 'Sapphire Lens Cover Rings (Lot #S109)', '2,500 units', '320.5 kg', 'Nitrogen Purged / Sealed'],
              ['PLT-2026-003', asn.poReference, 'Fluorosilicone O-Ring Gaskets (Lot #G882)', '7,500 units', '650.0 kg', 'Climate Controlled 20°C']
            ]
          },
          callout: {
            title: 'Weighbridge Instructions',
            text: 'Driver must display digital QR pass at gate scanner. Tare weight calculation will automatically trigger electronic GRN creation.',
            type: 'info'
          }
        }
      ],
      signatories: [
        {
          name: 'Vikram Rajput',
          role: 'Logistics & Dispatch Manager',
          organization: 'Precision Component Technologies Ltd',
          signatureDate: '2026-10-22'
        },
        {
          name: 'Chief Security Officer',
          role: 'Logistics Gate & Weighbridge Authority',
          organization: 'Apex Industrial Technologies Inc.',
          signatureDate: '2026-10-22'
        }
      ]
    });
  };

  const handleDownloadRfqSpecsDoc = (rfq: RFQItem) => {
    generateAndDownloadWordDoc(`Apex_RFQ_Technical_Drawing_${rfq.rfqNumber}`, {
      title: 'ENGINEERING RFQ TECHNICAL DRAWING & PROCUREMENT SPECIFICATION',
      documentRef: rfq.rfqNumber,
      classification: 'CONFIDENTIAL // B2B COMPETITIVE BID PACKAGE',
      department: 'Design Engineering & Strategic Sourcing',
      author: 'Dr. Marcus Reyes, Chief Engineer',
      summary: `Detailed engineering blueprint, metallurgical specifications, and competitive bidding guidelines for RFQ ${rfq.rfqNumber} (${rfq.partName}). Outlines production volumes, CAD model checksums, coordinate inspection criteria, and submission deadlines.`,
      sections: [
        {
          heading: '1. RFQ Technical Overview & Target Economics',
          content: [
            `Apex Industrial Technologies invites qualified Tier-1 manufacturing suppliers to submit formal binding quotations for component ${rfq.partName} (${rfq.partNumber}).`,
            `Target production commitment: ${rfq.targetQuantity.toLocaleString()} units with target cost envelope of ${rfq.targetPriceRange}.`
          ],
          table: {
            headers: ['Parameter', 'Specification Requirement', 'Verification Method'],
            rows: [
              ['Part Identification', `${rfq.partName} [${rfq.partNumber}]`, 'Visual Laser Engraving / 2D Barcode'],
              ['Material Substrate', 'Titanium Grade 5 (Ti-6Al-4V) Vacuum Melted', 'Spectrometry Mill Test Certificate'],
              ['Surface Finish', 'Anodized Type II Matte Black, Ra ≤ 0.2 µm', 'Profilometer & Optical Glossmeter'],
              ['Delivery Commitment', rfq.deliveryDueDate, 'Factory Receiving Bay Dock Door 3']
            ]
          }
        },
        {
          heading: '2. Subcontractor Bidding Rules & Submission Terms',
          content: [
            'All submitted quotes must itemize unit piece rate, tooling/NRE amortization, and production lead times in calendar days.',
            'Late submissions or deviations from geometry drawings will disqualify the bidding supplier from the evaluation matrix.'
          ],
          callout: {
            title: 'Proprietary IP Notice',
            text: 'CAD geometry files and 3D step models shared under this RFQ are covered by the Mutual Non-Disclosure Agreement (NDA). Unauthorized reproduction is strictly prohibited.',
            type: 'warning'
          }
        },
        {
          heading: '3. Precision CAD Orthographic Blueprint & GD&T Inspection Tolerances',
          subheading: 'ASME Y14.5M Geometric Dimensioning & CMM Verification Criteria',
          cadBlueprint: {
            drawingNumber: `DWG-${rfq.rfqNumber}-B2B`,
            revision: 'B',
            partName: `${rfq.partName} (${rfq.partNumber})`,
            material: 'Aerospace Titanium Ti-6Al-4V Vacuum Arc Remelted',
            surfaceFinish: 'Ra ≤ 0.2 µm Diamond Turned',
            units: 'MILLIMETERS [mm]',
            scale: '1:1',
            gdtCallouts: [
              {
                symbol: '⌖',
                tolerance: '⌀ 0.008 Ⓜ',
                datumRefs: 'A | B | C',
                description: 'Critical mounting datum positional tolerance at MMC',
              },
              {
                symbol: '⌓',
                tolerance: '0.003 mm',
                datumRefs: 'A',
                description: 'Mating surface optical flatness tolerance zone',
              },
            ],
            dimensions: [
              {
                featureId: 'RFQ-DIM-01',
                featureDescription: 'Overall Component Envelope Length',
                nominalMm: 146.50,
                toleranceMm: '±0.05 mm',
                uslMm: 146.55,
                lslMm: 146.45,
                measuredMm: 146.50,
                deviationMm: '0.00',
                inspectionMethod: 'Zeiss Coordinate Measuring Machine (CMM)',
                status: 'CONFORMING',
              },
              {
                featureId: 'RFQ-DIM-02',
                featureDescription: 'Transverse Profile Width',
                nominalMm: 72.80,
                toleranceMm: '±0.03 mm',
                uslMm: 72.83,
                lslMm: 72.77,
                measuredMm: 72.80,
                deviationMm: '0.00',
                inspectionMethod: 'Zeiss Coordinate Measuring Machine (CMM)',
                status: 'CONFORMING',
              },
            ],
          },
        }
      ],
      signatories: [
        {
          name: 'Dr. Marcus Reyes',
          role: 'VP of Hardware Design & Engineering',
          organization: 'Apex Industrial Technologies Inc.',
          signatureDate: '2026-10-22'
        },
        {
          name: 'David O\'Connor',
          role: 'Head of Strategic Global Sourcing',
          organization: 'Apex Industrial Technologies Inc.',
          signatureDate: '2026-10-22'
        }
      ]
    });
  };

  const handleExportVendorScorecardDoc = () => {
    generateAndDownloadWordDoc('Apex_Supplier_Quality_PPM_Scorecard_Q3', {
      title: 'ANNUAL SUPPLIER QUALITY PERFORMANCE & AUDIT DOSSIER',
      documentRef: 'SQA-VEND-2026-Q3-088',
      classification: 'OFFICIAL SUPPLIER PERFORMANCE RATING // TIER-1 ACCREDITATION',
      department: 'Supplier Quality Assurance & SCM Operations',
      author: 'Elena Rostova, VP Quality & Reliability',
      summary: 'Comprehensive rolling quarterly quality evaluation, Parts Per Million (PPM) defect scoring, On-Time In-Full (OTIF) delivery punctuality, and ISO 9001:2015 / IATF 16949 audit grading for Precision Component Technologies Ltd (Vendor Code: VEN-SC-001).',
      sections: [
        {
          heading: '1. Executive Supplier Quality Metrics Summary',
          content: [
            'Precision Component Technologies Ltd has maintained Preferred Tier-1 Vendor Status with an aggregate supplier excellence index score of 98.4 / 100 for Q3 2026.',
            'Quality defect frequency is measured at 18 PPM, significantly outperforming the contract threshold maximum of 50 PPM.'
          ],
          table: {
            headers: ['Evaluation Dimension', 'Current Rating', 'Benchmark Standard', 'Accreditation Status'],
            rows: [
              ['PPM Defect Rate', '18 PPM', '< 50 PPM', 'TIER-1 EXCELLENCE (TOP 5%)'],
              ['On-Time In-Full (OTIF) Delivery', '99.1%', '≥ 95.0%', 'EXCEEDS TARGET'],
              ['Invoice & Commercial Compliance', '100% (Zero Disputes)', '≥ 98.0%', 'PERFECT SCORE'],
              ['Corrective Action (8D) Cycle Time', '3.8 Days', '< 7.0 Days', 'RAPID RESOLUTION'],
              ['Overall Supplier Quality Rating', '98.4 / 100', '≥ 90.0', 'CERTIFIED PREFERRED VENDOR']
            ]
          }
        },
        {
          heading: '2. Cleanroom Audit & Traceability Compliance Review',
          content: [
            'On-site surveillance audit conducted by Apex SQA engineers confirmed full compliance with aerospace cleanroom protocols (ISO 14644 Class 7) and automated laser serialization traceability.'
          ],
          callout: {
            title: 'Early Remittance Discounting Eligibility',
            text: 'As an accredited Tier-1 Preferred Supplier with 100% commercial compliance, Precision Component Technologies is eligible for 10-day early settlement discount programs.',
            type: 'success'
          }
        }
      ],
      signatories: [
        {
          name: 'Elena Rostova',
          role: 'VP Quality & Supplier Reliability',
          organization: 'Apex Industrial Technologies Inc.',
          signatureDate: '2026-10-22'
        },
        {
          name: 'David O\'Connor',
          role: 'Global SCM Director',
          organization: 'Apex Industrial Technologies Inc.',
          signatureDate: '2026-10-22'
        },
        {
          name: 'Alexander Vance',
          role: 'Plant Director & General Manager',
          organization: 'Apex Industrial Technologies Inc.',
          signatureDate: '2026-10-22'
        }
      ]
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Factory className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              B2B Supplier Self-Service Gateway
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
              Authorized Partner: Precision Component Technologies Ltd (VEN-SC-001)
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Submit formal price bids on open RFQs, acknowledge purchase order releases, build Advance Shipping Notices (ASN), and track 3-way invoice payment clearance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAsnModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all"
          >
            <Plus className="h-4 w-4" /> Create Advance Shipping Notice (ASN)
          </button>
        </div>
      </div>

      {/* KPI Telemetry Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active PO Backlog</span>
            <Package className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">$126.8K</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">2 Active POs</span>
            <span>in production dispatch</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Consignments In-Transit</span>
            <Truck className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{asns.filter(a => a.status === 'IN_TRANSIT').length} Shipments</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
            <span>En route to North Weighbridge</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quality Scorecard</span>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">98.4%</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Tier-1 Preferred Supplier Status</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Invoices Approved</span>
            <DollarSign className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">$163.2K</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Next remittance: Oct 28, 2026</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="h-4 w-4" /> Purchase Orders & Delivery Schedules ({pos.length})
        </button>
        <button
          onClick={() => setActiveTab('asn')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'asn'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Truck className="h-4 w-4" /> Advance Shipping Notices (ASN) ({asns.length})
        </button>
        <button
          onClick={() => setActiveTab('rfqs')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'rfqs'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="h-4 w-4" /> Open RFQs & Competitive Bids ({rfqs.length})
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'invoices'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Receipt className="h-4 w-4" /> Submitted Invoices & 3-Way Match ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('scorecard')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'scorecard'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="h-4 w-4" /> Quality & Performance Scorecard
        </button>
      </div>

      {/* TAB 1: PURCHASE ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Active Purchase Orders Released by Apex</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Review contractual quantities, promised delivery windows, and download technical manufacturing prints.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">PO Number</th>
                  <th className="py-3 px-4">Release Date</th>
                  <th className="py-3 px-4">Promised Delivery</th>
                  <th className="py-3 px-4">Line Items</th>
                  <th className="py-3 px-4">Total Contract Value</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {pos.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Package className="h-4 w-4 text-emerald-500" />
                      {po.poNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{po.orderDate}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{po.promisedDate}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{po.lineItemsCount} Components</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">${po.totalValue.toLocaleString()} {po.currency}</td>
                    <td className="py-3.5 px-4">
                      {po.status === 'CONFIRMED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          Confirmed by Supplier
                        </span>
                      )}
                      {po.status === 'PENDING_CONFIRMATION' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                          Awaiting Confirmation
                        </span>
                      )}
                      {po.status === 'FULFILLED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
                          Completed & Fulfilled
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {po.status === 'PENDING_CONFIRMATION' && (
                        <button
                          onClick={() => handleConfirmPo(po.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold transition-all"
                        >
                          Confirm Schedule
                        </button>
                      )}
                      <button
                        onClick={() => handleDownloadPoSpecsDoc(po)}
                        title="Download Official PO Manufacturing Specifications in Word Format"
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-[11px] font-medium border border-slate-200 dark:border-slate-700 transition-all inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> Specs (.doc)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ADVANCE SHIPPING NOTICES (ASN) */}
      {activeTab === 'asn' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Inbound Advance Shipping Notices (ASN)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Generate digital gate passes for factory weighbridge fast-track clearance.</p>
            </div>
            <button
              onClick={() => setIsAsnModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all"
            >
              <Plus className="h-3.5 w-3.5" /> Dispatch Consignment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {asns.map((asn) => (
              <div key={asn.id} className="p-4 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono font-bold text-sm text-slate-900 dark:text-white">
                    <QrCode className="h-4 w-4 text-emerald-500" />
                    {asn.asnNumber}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    asn.status === 'IN_TRANSIT' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                  }`}>
                    {asn.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div><strong>PO Reference:</strong> <span className="font-mono text-emerald-600 dark:text-emerald-400">{asn.poReference}</span></div>
                  <div><strong>Vehicle / Truck:</strong> <span className="font-mono">{asn.vehicleNumber}</span> ({asn.transporterName})</div>
                  <div><strong>Driver Contact:</strong> {asn.driverName} • {asn.driverPhone}</div>
                  <div><strong>Container Security Seal:</strong> <span className="font-mono text-pink-600 dark:text-pink-400">{asn.containerSealNumber}</span></div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Cartons: <strong>{asn.totalCartons}</strong> ({asn.grossWeightKg} kg)</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadAsnManifestDoc(asn)}
                      title="Download Official ASN Freight Manifest in Word Format"
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded text-[11px] font-medium border border-slate-200 dark:border-slate-700 transition-all inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> Manifest (.doc)
                    </button>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">ETA: {asn.estimatedArrival}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: OPEN RFQS */}
      {activeTab === 'rfqs' && (
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Competitive Sourcing & SCM Requests for Quotation</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Submit competitive bids on engineering releases to secure upcoming production allocations.</p>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {rfqs.map((rfq) => (
              <div key={rfq.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{rfq.rfqNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rfq.status === 'BID_SUBMITTED' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    }`}>
                      {rfq.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{rfq.partName}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Part No: <span className="font-mono">{rfq.partNumber}</span> • Target Quantity: <strong>{rfq.targetQuantity.toLocaleString()} pcs</strong> • Due: {rfq.deliveryDueDate}
                  </div>
                  {rfq.submittedBid && (
                    <div className="mt-2 text-xs bg-slate-100 dark:bg-slate-800/60 p-2 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      <strong>Your Submitted Bid:</strong> ${rfq.submittedBid.unitRate.toFixed(2)}/pc • Lead Time: {rfq.submittedBid.leadTimeDays} days • Tooling NRE: ${rfq.submittedBid.toolingNre}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rfq.status === 'OPEN_FOR_BID' && (
                    <button
                      onClick={() => {
                        setSelectedRfq(rfq);
                        setBidRate('3.95');
                      }}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                    >
                      Submit Formal Bid
                    </button>
                  )}
                  <button
                    onClick={() => handleDownloadRfqSpecsDoc(rfq)}
                    title="Download Official RFQ Technical Drawing Dossier in Word Format"
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> Technical Drawings (.doc)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SUBMITTED INVOICES */}
      {activeTab === 'invoices' && (
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Tax Invoices & 3-Way Reconciliation Ledger</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Monitor status against warehouse Goods Receipt Notes (GRN) and automated finance matching.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Linked PO</th>
                  <th className="py-3 px-4">Linked ASN</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Billed Amount</th>
                  <th className="py-3 px-4">Tax (GST/VAT)</th>
                  <th className="py-3 px-4">Reconciliation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">{inv.invoiceNumber}</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-600 dark:text-emerald-400">{inv.poNumber}</td>
                    <td className="py-3.5 px-4 font-mono text-blue-600 dark:text-blue-400">{inv.asnNumber}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{inv.invoiceDate}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">${inv.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-slate-500">${inv.taxAmount.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      {inv.matchingStatus === 'MATCHED_APPROVED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          3-Way Matched & Approved
                        </span>
                      )}
                      {inv.matchingStatus === 'PENDING_GRN_VERIFICATION' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                          Awaiting Weighbridge GRN
                        </span>
                      )}
                      {inv.matchingStatus === 'PAID' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
                          Payment Disbursed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SCORECARD */}
      {activeTab === 'scorecard' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Supplier Quality Rating & Annual PPM Audit</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Quarterly certified performance metrics, cleanroom compliance, and early discount eligibility.</p>
            </div>
            <button
              onClick={handleExportVendorScorecardDoc}
              title="Download Official Vendor Quality & PPM Scorecard in Word Format"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" /> Export Scorecard (.doc)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-500" /> Quality & PPM Score
            </h3>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">18 PPM</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Parts Per Million defect threshold target is &lt; 50 PPM. Your facility is currently in the top 5% of certified vendors.</p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[96%]" />
            </div>
            <div className="text-[11px] text-slate-500">Quality Audit Passed: ISO 9001:2015 & IATF 16949 Certified</div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" /> On-Time In-Full (OTIF)
            </h3>
            <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">99.1%</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Shipment delivery punctuality against agreed PO target schedule over the rolling 90 days.</p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[99%]" />
            </div>
            <div className="text-[11px] text-slate-500">Zero line-stoppage penalties assessed</div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-purple-500" /> Commercial Compliance
            </h3>
            <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">100%</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Zero debit note disputes or tax invoice discrepancies on record for Q3-Q4.</p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full w-full" />
            </div>
            <div className="text-[11px] text-slate-500">Eligible for Priority Early Remittance Discounting</div>
          </div>
        </div>
      </div>
      )}

      {/* MODAL: SUBMIT FORMAL BID */}
      {selectedRfq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Submit Binding Quote: {selectedRfq.rfqNumber}</h3>
              <button onClick={() => setSelectedRfq(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-md">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300">
              Component: <strong>{selectedRfq.partName}</strong> (Qty: {selectedRfq.targetQuantity.toLocaleString()})
            </div>
            <form onSubmit={handleSubmitBid} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Unit Quoted Rate ($ / pc)</label>
                <input
                  type="number"
                  step="0.01"
                  value={bidRate}
                  onChange={(e) => setBidRate(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Production Lead Time (Days)</label>
                  <input
                    type="number"
                    value={bidLeadTime}
                    onChange={(e) => setBidLeadTime(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tooling / NRE Fee ($)</label>
                  <input
                    type="number"
                    value={bidNre}
                    onChange={(e) => setBidNre(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRfq(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Submit Binding Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE ASN */}
      {isAsnModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create Advance Shipping Notice (ASN)</h3>
              <button onClick={() => setIsAsnModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-md">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateAsn} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Purchase Order Reference</label>
                <select
                  value={newAsnPo}
                  onChange={(e) => setNewAsnPo(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                >
                  {pos.map((p) => (
                    <option key={p.id} value={p.poNumber}>{p.poNumber} (${p.totalValue.toLocaleString()})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Vehicle License Plate</label>
                  <input
                    type="text"
                    placeholder="MH-12-RN-8821"
                    value={newAsnTruck}
                    onChange={(e) => setNewAsnTruck(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Freight Carrier</label>
                  <input
                    type="text"
                    value={newAsnTransporter}
                    onChange={(e) => setNewAsnTransporter(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Driver Name & Mobile</label>
                  <input
                    type="text"
                    placeholder="Driver Name"
                    value={newAsnDriver}
                    onChange={(e) => setNewAsnDriver(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Estimated Weighbridge Arrival</label>
                  <input
                    type="text"
                    value={newAsnEta}
                    onChange={(e) => setNewAsnEta(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAsnModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Generate ASN & Manifest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
