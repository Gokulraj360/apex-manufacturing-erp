'use client';

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  X,
  HelpCircle,
  Tag,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface GlossaryTerm {
  term: string;
  category: 'Manufacturing' | 'Finance' | 'Supply Chain' | 'Quality' | 'Governance & HR';
  plainTranslation: string;
  simpleExplanation: string;
  example: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'OEE (Overall Equipment Effectiveness)',
    category: 'Manufacturing',
    plainTranslation: 'Machine Running Efficiency',
    simpleExplanation: 'A score showing how well your factory machines are actually running compared to their theoretical maximum capacity. It measures Availability, Speed, and Quality.',
    example: '88% OEE means machines are rarely broken, running at high speed, and producing virtually zero scrap.',
  },
  {
    term: 'FPY (First Pass Yield)',
    category: 'Quality',
    plainTranslation: 'First-Time Quality Pass Rate',
    simpleExplanation: 'The percentage of manufactured units that pass all tests and inspections on the very first try without needing to be reworked, fixed, or scrapped.',
    example: '98.8% FPY means nearly 99 out of every 100 units roll off the line in flawless condition.',
  },
  {
    term: 'BOM (Bill of Materials)',
    category: 'Manufacturing',
    plainTranslation: 'Product Parts & Ingredients Recipe',
    simpleExplanation: 'The complete master list of all raw materials, sub-assemblies, electronic chips, screws, and packaging required to build one finished product.',
    example: 'To build 1,000 controllers, the BOM calculates exactly how many circuit boards and capacitors the warehouse must issue.',
  },
  {
    term: 'ECN (Engineering Change Notice)',
    category: 'Manufacturing',
    plainTranslation: 'Blueprint Modification Approval',
    simpleExplanation: 'An official formal request to modify a product design, swap an obsolete part, or update tolerances before factory assembly begins.',
    example: 'Replacing a discontinued microchip with a newer equivalent requires an approved ECN sign-off.',
  },
  {
    term: 'SoD (Separation of Duties)',
    category: 'Governance & HR',
    plainTranslation: 'Fraud & Error Prevention Rules',
    simpleExplanation: 'A security rule that prevents one single person from having enough permissions to create an order, approve it, and issue payment to themselves.',
    example: 'A purchasing officer cannot also be the person who approves supplier payments in Accounts Payable.',
  },
  {
    term: 'CCC (Cash Conversion Cycle)',
    category: 'Finance',
    plainTranslation: 'Cash Recovery Speed',
    simpleExplanation: 'How many days it takes for money spent buying raw materials to return to company bank accounts as cash collected from customer sales.',
    example: 'A 42-day CCC means every dollar invested in factory production returns in 6 weeks.',
  },
  {
    term: 'EBITDA',
    category: 'Finance',
    plainTranslation: 'Core Operating Profit',
    simpleExplanation: 'Earnings Before Interest, Taxes, Depreciation, and Amortization. It shows how much profit the core factory operations generate before accounting and tax adjustments.',
    example: '$18.2M EBITDA reflects healthy operational margins across our Austin electronics lines.',
  },
  {
    term: 'CapEx vs OpEx',
    category: 'Finance',
    plainTranslation: 'Equipment Investments vs Daily Running Costs',
    simpleExplanation: 'CapEx (Capital Expenditure) is money spent buying long-term assets like CNC machines. OpEx (Operating Expenses) is ongoing costs like electricity, rent, and wages.',
    example: 'Buying a $250k robotic arm is CapEx; electricity to run it daily is OpEx.',
  },
  {
    term: '3-Way AP Matching',
    category: 'Finance',
    plainTranslation: 'Invoice Verification Check',
    simpleExplanation: 'An automated fraud prevention check that verifies 3 documents match perfectly before paying a supplier: 1. Purchase Order, 2. Warehouse Receiving Slip, 3. Supplier Invoice.',
    example: 'If a vendor bills for 500 units but the dock only received 450, payment is held until resolved.',
  },
  {
    term: 'GRN (Goods Receipt Note)',
    category: 'Supply Chain',
    plainTranslation: 'Dock Delivery Receipt',
    simpleExplanation: 'The official digital document generated when an inbound delivery truck unloads physical boxes at the factory bay, confirming items arrived.',
    example: 'Warehouse staff scan incoming crates and generate a GRN confirming 1,000 resistors were received.',
  },
  {
    term: 'ASN (Advance Shipping Notice)',
    category: 'Supply Chain',
    plainTranslation: 'Incoming Delivery Alert',
    simpleExplanation: 'A pre-alert sent by a supplier letting the warehouse know a shipment has departed, which truck is carrying it, and when it will arrive at the dock.',
    example: 'Allows dock staff to reserve an unloading bay 2 hours before the truck pulls in.',
  },
  {
    term: 'PO (Purchase Order)',
    category: 'Supply Chain',
    plainTranslation: 'Official Commercial Order',
    simpleExplanation: 'A legally binding contract issued to a vendor committing to purchase specified parts at an agreed price and delivery date.',
    example: 'PO-2026-089 authorizes supplier Acme Corp to deliver 2,000 aluminum housings.',
  },
  {
    term: 'RFQ (Request for Quotation)',
    category: 'Supply Chain',
    plainTranslation: 'Supplier Price Bidding Request',
    simpleExplanation: 'An invitation sent to multiple qualified suppliers asking them to submit their best price, lead time, and warranty terms for parts we need.',
    example: 'Comparing 3 vendor bids on RFQ-2026-014 ensures we get the best market pricing.',
  },
  {
    term: 'MRP (Material Requirements Planning)',
    category: 'Supply Chain',
    plainTranslation: 'Intelligent Stock & Buying Schedule',
    simpleExplanation: 'An automated calculation that looks at upcoming customer orders, subtracts current stock, and tells buyers exactly what to order and when.',
    example: 'MRP detects an upcoming shortage of 500 connectors and automatically drafts purchase requisitions.',
  },
  {
    term: 'MTBF (Mean Time Between Failures)',
    category: 'Manufacturing',
    plainTranslation: 'Average Machine Uptime',
    simpleExplanation: 'The average number of operating hours a machine runs before experiencing an unplanned breakdown.',
    example: 'A 720-hour MTBF means the SMT machine runs an entire month between minor faults.',
  },
  {
    term: 'MTTR (Mean Time to Repair)',
    category: 'Manufacturing',
    plainTranslation: 'Average Machine Fix Time',
    simpleExplanation: 'The average time it takes for maintenance technicians to diagnose and repair a broken machine to get it running again.',
    example: 'A 28-minute MTTR means lines are quickly restored after a fault.',
  },
  {
    term: 'PPM (Parts Per Million)',
    category: 'Quality',
    plainTranslation: 'Defect Ratio Benchmark',
    simpleExplanation: 'A precision quality standard measuring how many defective parts occur per 1,000,000 manufactured units.',
    example: '15 PPM represents aerospace-grade manufacturing where fewer than 15 parts in a million have defects.',
  },
  {
    term: 'GD&T (Geometric Dimensioning & Tolerancing)',
    category: 'Manufacturing',
    plainTranslation: 'Sub-Micron Precision Tolerances',
    simpleExplanation: 'An international engineering language using symbols (like ⌀ for diameter or ⌖ for position) to define exact allowable size variations on parts.',
    example: 'Ensures parts machined in Germany fit perfectly with assemblies built in Texas.',
  },
  {
    term: 'RMA (Return Merchandise Authorization)',
    category: 'Quality',
    plainTranslation: 'Customer Warranty Return Claim',
    simpleExplanation: 'An approved tracking code given to a customer so they can send back a defective or damaged unit for laboratory analysis, repair, or replacement.',
    example: 'RMA-2026-012 authorizes a customer to ship back a malfunctioning sensor under warranty.',
  },
  {
    term: 'CoC (Certificate of Conformance)',
    category: 'Quality',
    plainTranslation: 'Certified Quality Lab Stamp',
    simpleExplanation: 'An official signed document proving that a manufactured batch meets all contractual specifications, RoHS environmental laws, and test tolerances.',
    example: 'Every aerospace or medical shipment requires a CoC before the customer accepts delivery.',
  },
  {
    term: 'WIP (Work In Progress)',
    category: 'Manufacturing',
    plainTranslation: 'Units Currently Being Built',
    simpleExplanation: 'Raw materials and components that have left the warehouse and are currently on the factory floor being assembled or waiting for testing.',
    example: 'Keeping WIP low prevents crowded assembly lines and reduces inventory carrying costs.',
  },
];

export function ErpDictionaryModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Manufacturing', 'Finance', 'Supply Chain', 'Quality', 'Governance & HR'];

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((t) => {
      const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
      const q = search.toLowerCase();
      const matchesSearch =
        t.term.toLowerCase().includes(q) ||
        t.plainTranslation.toLowerCase().includes(q) ||
        t.simpleExplanation.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [search, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Apex Plain-English ERP Dictionary & Cheatsheet
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Every business acronym, manufacturing metric, and workflow explained in everyday human terms.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1322] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by acronym (e.g. OEE, FPY, BOM, SoD, CCC) or plain description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Term Cards List */}
        <div className="p-4 overflow-y-auto space-y-3 divide-y divide-slate-100 dark:divide-slate-800/60 flex-1">
          {filteredTerms.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching terms found for &quot;{search}&quot;. Try searching for &quot;OEE&quot;, &quot;Profit&quot;, or &quot;Quality&quot;.
            </div>
          ) : (
            filteredTerms.map((t, idx) => (
              <div key={idx} className="pt-3 first:pt-0 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                      {t.term}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                      {t.plainTranslation}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {t.category}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {t.simpleExplanation}
                </p>

                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                  <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">Real-World Example:</span>
                  <span>{t.example}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredTerms.length} industrial terms</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Close Cheatsheet
          </button>
        </div>
      </div>
    </div>
  );
}
