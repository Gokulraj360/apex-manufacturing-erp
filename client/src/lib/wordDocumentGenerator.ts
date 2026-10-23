/**
 * Apex Enterprise Word Document (.doc) Generator
 * 
 * Generates rich, high-density, professional corporate Microsoft Word documents (.doc)
 * with official company letterhead, CAGE/DUNS codes, ISO/AS9100 regulatory seals,
 * technical CAD orthographic engineering schematics, GD&T tolerancing frames,
 * CMM metrology inspection data tables, and multi-signatory governance blocks.
 * 
 * Optimized with compact page geometry (0.6in margins) to maximize information density
 * without unsightly blank space or awkward page breaks.
 */

export interface CadDimensionItem {
  featureId: string;
  featureDescription: string;
  nominalMm: number | string;
  toleranceMm: string;
  uslMm: number | string; // Upper Spec Limit
  lslMm: number | string; // Lower Spec Limit
  measuredMm: number | string;
  deviationMm: number | string;
  inspectionMethod: string;
  status: 'CONFORMING' | 'NON_CONFORMING' | 'CRITICAL_PASS';
}

export interface CadBlueprintSpec {
  drawingNumber: string;
  revision: string;
  partName: string;
  material: string;
  surfaceFinish: string;
  heatTreatment?: string;
  units: 'MILLIMETERS [mm]' | 'INCHES [in]';
  scale: string;
  thirdAngleProjection?: boolean;
  gdtCallouts?: {
    symbol: string; // e.g., '⌖' (Position), '⌓' (Profile), '⟂' (Perpendicularity)
    tolerance: string;
    datumRefs: string;
    description: string;
  }[];
  dimensions: CadDimensionItem[];
  customSvgSnippet?: string;
}

export interface WordDocSection {
  heading: string;
  subheading?: string;
  content?: string[];
  table?: {
    headers: string[];
    rows: (string | number)[][];
    columnWidths?: string[];
  };
  callout?: {
    title: string;
    text: string;
    type?: 'info' | 'warning' | 'success';
  };
  cadBlueprint?: CadBlueprintSpec;
}

export interface WordDocOptions {
  title: string;
  documentRef: string;
  classification?: string;
  department: string;
  author: string;
  date?: string;
  summary: string;
  sections: WordDocSection[];
  signatories?: {
    name: string;
    role: string;
    organization: string;
    signatureDate: string;
  }[];
}

/**
 * Generates a standard high-precision SVG engineering blueprint diagram
 */
function renderVectorCadDrawingSvg(spec: CadBlueprintSpec): string {
  if (spec.customSvgSnippet) {
    return spec.customSvgSnippet;
  }

  return `
    <div style="background-color: #071527; border: 1.5pt solid #1e3a8a; padding: 12pt; border-radius: 4pt; margin: 10pt 0;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e40af; padding-bottom: 6pt; margin-bottom: 8pt;">
        <div>
          <span style="font-family: Consolas, monospace; font-size: 11pt; font-weight: bold; color: #38bdf8;">CAD SCHEMATIC: ${spec.partName.toUpperCase()}</span>
          <span style="font-size: 8.5pt; color: #94a3b8; margin-left: 8pt;">[DWG: ${spec.drawingNumber} | REV ${spec.revision}]</span>
        </div>
        <div style="font-family: Consolas, monospace; font-size: 8pt; color: #60a5fa;">
          SCALE ${spec.scale} | UNITS: ${spec.units} | 3RD ANGLE PROJECTION
        </div>
      </div>

      <!-- Vector Blueprint SVG -->
      <svg width="100%" height="220" viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" style="background-color: #030d1a; border: 1px dashed #1e3a8a;">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0a2540" stroke-width="0.75"/>
          </pattern>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#38bdf8"/>
          </marker>
        </defs>
        <rect width="720" height="220" fill="url(#grid)" />

        <!-- Centerlines -->
        <line x1="80" y1="110" x2="640" y2="110" stroke="#f43f5e" stroke-width="0.8" stroke-dasharray="12,4,3,4" />
        <line x1="240" y1="20" x2="240" y2="200" stroke="#f43f5e" stroke-width="0.8" stroke-dasharray="12,4,3,4" />
        <line x1="480" y1="20" x2="480" y2="200" stroke="#f43f5e" stroke-width="0.8" stroke-dasharray="12,4,3,4" />

        <!-- Main Enclosure Outer Geometry (Front Elevation) -->
        <rect x="120" y="45" width="240" height="130" rx="6" fill="#0f2642" stroke="#38bdf8" stroke-width="2.2" />

        <!-- Internal Heat Dissipation Fin Grid (Detail) -->
        <rect x="135" y="60" width="210" height="40" fill="#071b30" stroke="#38bdf8" stroke-width="1.2" />
        <line x1="165" y1="60" x2="165" y2="100" stroke="#38bdf8" stroke-width="1" />
        <line x1="195" y1="60" x2="195" y2="100" stroke="#38bdf8" stroke-width="1" />
        <line x1="225" y1="60" x2="225" y2="100" stroke="#38bdf8" stroke-width="1" />
        <line x1="255" y1="60" x2="255" y2="100" stroke="#38bdf8" stroke-width="1" />
        <line x1="285" y1="60" x2="285" y2="100" stroke="#38bdf8" stroke-width="1" />
        <line x1="315" y1="60" x2="315" y2="100" stroke="#38bdf8" stroke-width="1" />

        <!-- 4x Precision Mounting Bores with Counterbores -->
        <circle cx="145" cy="150" r="10" fill="#030d1a" stroke="#38bdf8" stroke-width="1.6" />
        <circle cx="145" cy="150" r="5" fill="#071527" stroke="#38bdf8" stroke-width="1" />

        <circle cx="335" cy="150" r="10" fill="#030d1a" stroke="#38bdf8" stroke-width="1.6" />
        <circle cx="335" cy="150" r="5" fill="#071527" stroke="#38bdf8" stroke-width="1" />

        <!-- Orthographic Side Profile (Section A-A) -->
        <rect x="420" y="45" width="60" height="130" fill="#0f2642" stroke="#38bdf8" stroke-width="2.2" />
        <line x1="420" y1="58" x2="480" y2="58" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="3,3" />
        <line x1="420" y1="162" x2="480" y2="162" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="3,3" />

        <!-- Isometric Preview Box -->
        <polygon points="540,110 590,85 640,110 590,135" fill="#0e2f50" stroke="#38bdf8" stroke-width="1.4" />
        <polygon points="540,110 540,150 590,175 590,135" fill="#071b30" stroke="#38bdf8" stroke-width="1.4" />
        <polygon points="640,110 640,150 590,175 590,135" fill="#0b243e" stroke="#38bdf8" stroke-width="1.4" />

        <!-- Dimension Lines with Arrows & Text Callouts -->
        <!-- Top Width Dimension -->
        <line x1="120" y1="30" x2="360" y2="30" stroke="#38bdf8" stroke-width="1" marker-start="url(#arrow)" marker-end="url(#arrow)" />
        <line x1="120" y1="25" x2="120" y2="45" stroke="#38bdf8" stroke-width="0.8" />
        <line x1="360" y1="25" x2="360" y2="45" stroke="#38bdf8" stroke-width="0.8" />
        <text x="240" y="24" fill="#67e8f9" font-family="Consolas, monospace" font-size="11" text-anchor="middle" font-weight="bold">146.50 ± 0.05 mm [NOMINAL SPAN]</text>

        <!-- Left Height Dimension -->
        <line x1="100" y1="45" x2="100" y2="175" stroke="#38bdf8" stroke-width="1" marker-start="url(#arrow)" marker-end="url(#arrow)" />
        <line x1="95" y1="45" x2="120" y2="45" stroke="#38bdf8" stroke-width="0.8" />
        <line x1="95" y1="175" x2="120" y2="175" stroke="#38bdf8" stroke-width="0.8" />
        <text x="92" y="115" fill="#67e8f9" font-family="Consolas, monospace" font-size="10" text-anchor="end" font-weight="bold">72.80 ± 0.03</text>

        <!-- Thickness Dimension on Side View -->
        <line x1="420" y1="190" x2="480" y2="190" stroke="#38bdf8" stroke-width="1" marker-start="url(#arrow)" marker-end="url(#arrow)" />
        <text x="450" y="204" fill="#67e8f9" font-family="Consolas, monospace" font-size="10" text-anchor="middle" font-weight="bold">8.45 ± 0.02</text>

        <!-- Bores Callout -->
        <line x1="335" y1="150" x2="370" y2="170" stroke="#fbbf24" stroke-width="1" />
        <text x="375" y="174" fill="#fde047" font-family="Consolas, monospace" font-size="9" font-weight="bold">4x ⌀ 4.20 H7 (+0.012/-0.000)</text>
      </svg>

      <!-- Drawing Metadata Bar -->
      <table style="width: 100%; border-collapse: collapse; margin-top: 6pt; background-color: #030d1a; border: 1px solid #1e3a8a;">
        <tr style="font-family: Consolas, monospace; font-size: 8pt; color: #93c5fd;">
          <td style="padding: 4pt 8pt; border-right: 1px solid #1e3a8a;">MATERIAL: <strong style="color: #ffffff;">${spec.material}</strong></td>
          <td style="padding: 4pt 8pt; border-right: 1px solid #1e3a8a;">FINISH: <strong style="color: #ffffff;">${spec.surfaceFinish}</strong></td>
          <td style="padding: 4pt 8pt; border-right: 1px solid #1e3a8a;">PROJECTION: <strong style="color: #ffffff;">ASME Y14.5-2018</strong></td>
          <td style="padding: 4pt 8pt;">TOLERANCE CLASS: <strong style="color: #ffffff;">ISO 2768-mK FINE</strong></td>
        </tr>
      </table>
    </div>
  `;
}

/**
 * Main export function to generate and download Word document (.doc)
 */
export function generateAndDownloadWordDoc(filename: string, options: WordDocOptions) {
  const currentDate = options.date || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const classification = options.classification || 'CONFIDENTIAL & PROPRIETARY — INTERNAL OPERATIONAL USE ONLY';

  // Build HTML string formatted specifically for Microsoft Word (.doc)
  const sectionsHtml = options.sections
    .map((sec, idx) => {
      let contentHtml = '';
      if (sec.content && sec.content.length > 0) {
        contentHtml = sec.content
          .map((p) => `<p style="font-size: 9.5pt; line-height: 1.42; color: #1e293b; margin: 0 0 6pt 0;">${p}</p>`)
          .join('');
      }

      let calloutHtml = '';
      if (sec.callout) {
        const bg = sec.callout.type === 'success' ? '#f0fdf4' : sec.callout.type === 'warning' ? '#fffbeb' : '#eff6ff';
        const border = sec.callout.type === 'success' ? '#16a34a' : sec.callout.type === 'warning' ? '#d97706' : '#2563eb';
        calloutHtml = `
          <div style="background-color: ${bg}; border-left: 3.5pt solid ${border}; padding: 6pt 10pt; margin: 8pt 0; font-size: 9pt;">
            <strong style="color: ${border}; display: block; margin-bottom: 2pt;">${sec.callout.title}</strong>
            <span style="color: #374151;">${sec.callout.text}</span>
          </div>
        `;
      }

      let cadHtml = '';
      if (sec.cadBlueprint) {
        cadHtml = renderVectorCadDrawingSvg(sec.cadBlueprint);

        // GD&T Feature Control Frames Table
        if (sec.cadBlueprint.gdtCallouts && sec.cadBlueprint.gdtCallouts.length > 0) {
          const gdtRows = sec.cadBlueprint.gdtCallouts
            .map(
              (g) => `
              <tr style="border-bottom: 1px solid #cbd5e1; font-size: 8.5pt;">
                <td style="padding: 4pt 8pt; font-family: Consolas, monospace; font-size: 11pt; font-weight: bold; color: #1e3a8a; text-align: center; border: 1px solid #94a3b8; background-color: #f1f5f9;">${g.symbol}</td>
                <td style="padding: 4pt 8pt; font-family: Consolas, monospace; font-weight: bold; border: 1px solid #94a3b8; background-color: #f8fafc;">${g.tolerance}</td>
                <td style="padding: 4pt 8pt; font-family: Consolas, monospace; font-weight: bold; border: 1px solid #94a3b8; background-color: #f8fafc;">${g.datumRefs}</td>
                <td style="padding: 4pt 8pt; color: #334155; border: 1px solid #94a3b8;">${g.description}</td>
              </tr>
            `
            )
            .join('');

          cadHtml += `
            <div style="margin: 8pt 0;">
              <strong style="font-size: 8.5pt; text-transform: uppercase; color: #0f172a; display: block; margin-bottom: 3pt;">
                Geometric Dimensioning & Tolerancing (GD&T) Feature Control Frames (ASME Y14.5M)
              </strong>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 8pt;">
                <thead>
                  <tr style="background-color: #0f172a; color: #ffffff; font-size: 8pt; text-align: left;">
                    <th style="padding: 4pt 8pt; border: 1px solid #0f172a; width: 45pt; text-align: center;">Char</th>
                    <th style="padding: 4pt 8pt; border: 1px solid #0f172a; width: 110pt;">Tolerance Zone</th>
                    <th style="padding: 4pt 8pt; border: 1px solid #0f172a; width: 70pt;">Datums</th>
                    <th style="padding: 4pt 8pt; border: 1px solid #0f172a;">Engineering Justification & Inspection Criteria</th>
                  </tr>
                </thead>
                <tbody>${gdtRows}</tbody>
              </table>
            </div>
          `;
        }

        // CMM Coordinate Metrology Inspection Table
        if (sec.cadBlueprint.dimensions && sec.cadBlueprint.dimensions.length > 0) {
          const dimRows = sec.cadBlueprint.dimensions
            .map((dim, rIdx) => {
              const bg = rIdx % 2 === 0 ? '#ffffff' : '#f8fafc';
              const statusColor = dim.status === 'CONFORMING' || dim.status === 'CRITICAL_PASS' ? '#059669' : '#dc2626';
              return `
                <tr style="background-color: ${bg}; font-size: 8.5pt;">
                  <td style="padding: 4pt 6pt; font-family: Consolas, monospace; font-weight: bold; border: 1px solid #cbd5e1;">${dim.featureId}</td>
                  <td style="padding: 4pt 6pt; border: 1px solid #cbd5e1; color: #1e293b;">${dim.featureDescription}</td>
                  <td style="padding: 4pt 6pt; font-family: Consolas, monospace; text-align: right; border: 1px solid #cbd5e1;">${dim.nominalMm}</td>
                  <td style="padding: 4pt 6pt; font-family: Consolas, monospace; text-align: center; border: 1px solid #cbd5e1; color: #475569;">${dim.toleranceMm}</td>
                  <td style="padding: 4pt 6pt; font-family: Consolas, monospace; text-align: right; border: 1px solid #cbd5e1; font-weight: bold;">${dim.measuredMm}</td>
                  <td style="padding: 4pt 6pt; font-family: Consolas, monospace; text-align: right; border: 1px solid #cbd5e1; color: #2563eb;">${dim.deviationMm}</td>
                  <td style="padding: 4pt 6pt; border: 1px solid #cbd5e1; font-size: 8pt; color: #475569;">${dim.inspectionMethod}</td>
                  <td style="padding: 4pt 6pt; text-align: center; border: 1px solid #cbd5e1; font-weight: bold; font-size: 8pt; color: ${statusColor};">${dim.status}</td>
                </tr>
              `;
            })
            .join('');

          cadHtml += `
            <div style="margin: 8pt 0;">
              <strong style="font-size: 8.5pt; text-transform: uppercase; color: #0f172a; display: block; margin-bottom: 3pt;">
                Coordinate Metrology Machine (CMM) Dimensional Verification & Tolerance Table
              </strong>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 8pt;">
                <thead>
                  <tr style="background-color: #1e293b; color: #ffffff; font-size: 8pt; text-align: left;">
                    <th style="padding: 4pt 6pt; border: 1px solid #1e293b;">Item</th>
                    <th style="padding: 4pt 6pt; border: 1px solid #1e293b;">Feature Description</th>
                    <th style="padding: 4pt 6pt; border: 1px solid #1e293b; text-align: right;">Nominal</th>
                    <th style="padding: 4pt 6pt; border: 1px solid #1e293b; text-align: center;">Tol</th>
                    <th style="padding: 4pt 6pt; border: 1px solid #1e293b; text-align: right;">Measured</th>
                    <th style="padding: 4pt 6pt; border: 1px solid #1e293b; text-align: right;">Dev</th>
                    <th style="padding: 4pt 6pt; border: 1px solid #1e293b;">Tool / Metrology Rig</th>
                    <th style="padding: 4pt 6pt; border: 1px solid #1e293b; text-align: center;">Verdict</th>
                  </tr>
                </thead>
                <tbody>${dimRows}</tbody>
              </table>
            </div>
          `;
        }
      }

      let tableHtml = '';
      if (sec.table && sec.table.headers.length > 0) {
        const headerCells = sec.table.headers
          .map(
            (h, hIdx) => {
              const widthStyle = sec.table?.columnWidths && sec.table.columnWidths[hIdx]
                ? `width: ${sec.table.columnWidths[hIdx]};`
                : '';
              return `<th style="background-color: #1e293b; color: #ffffff; padding: 5pt 7pt; font-size: 8.5pt; text-align: left; border: 1px solid #cbd5e1; ${widthStyle}">${h}</th>`;
            }
          )
          .join('');

        const rowTrs = sec.table.rows
          .map((row, rIdx) => {
            const bg = rIdx % 2 === 0 ? '#ffffff' : '#f8fafc';
            const cells = row
              .map(
                (cell) =>
                  `<td style="padding: 4.5pt 7pt; font-size: 8.5pt; color: #334155; border: 1px solid #cbd5e1; line-height: 1.3;">${cell}</td>`
              )
              .join('');
            return `<tr style="background-color: ${bg};">${cells}</tr>`;
          })
          .join('');

        tableHtml = `
          <table style="width: 100%; border-collapse: collapse; margin: 8pt 0; font-family: Calibri, Arial, sans-serif;">
            <thead>
              <tr>${headerCells}</tr>
            </thead>
            <tbody>
              ${rowTrs}
            </tbody>
          </table>
        `;
      }

      return `
        <div style="margin-bottom: 14pt; page-break-inside: avoid;">
          <h2 style="font-size: 11pt; font-weight: bold; color: #0f172a; border-bottom: 1.5pt solid #cbd5e1; padding-bottom: 3pt; margin: 0 0 6pt 0; text-transform: uppercase; letter-spacing: 0.3pt;">
            ${idx + 1}. ${sec.heading}
          </h2>
          ${sec.subheading ? `<div style="font-size: 8.5pt; font-weight: bold; color: #2563eb; margin: -3pt 0 5pt 0;">${sec.subheading}</div>` : ''}
          ${contentHtml}
          ${calloutHtml}
          ${cadHtml}
          ${tableHtml}
        </div>
      `;
    })
    .join('');

  // Signatory Block
  let signatoriesHtml = '';
  if (options.signatories && options.signatories.length > 0) {
    const sigBoxes = options.signatories
      .map(
        (sig) => `
        <td style="width: ${Math.floor(100 / options.signatories!.length)}%; vertical-align: top; padding: 8pt 10pt; border: 1px solid #cbd5e1; background-color: #f8fafc;">
          <div style="font-size: 7.5pt; color: #64748b; text-transform: uppercase; font-weight: bold;">Executive Signatory</div>
          <div style="height: 28pt; border-bottom: 1px dashed #94a3b8; margin: 4pt 0; display: flex; align-items: flex-end;">
            <span style="font-family: 'Brush Script MT', cursive; font-size: 14pt; color: #1e3a8a;">${sig.name}</span>
          </div>
          <div style="font-size: 9pt; font-weight: bold; color: #0f172a;">${sig.name}</div>
          <div style="font-size: 8pt; color: #475569;">${sig.role}</div>
          <div style="font-size: 7.5pt; color: #64748b;">${sig.organization}</div>
          <div style="font-size: 7.5pt; color: #059669; font-weight: bold; margin-top: 2pt;">Validated: ${sig.signatureDate}</div>
        </td>
      `
      )
      .join('');

    signatoriesHtml = `
      <div style="margin-top: 14pt; page-break-inside: avoid;">
        <h3 style="font-size: 9.5pt; font-weight: bold; color: #0f172a; margin: 0 0 4pt 0; text-transform: uppercase;">
          Execution & Digital Governance Authorization Record
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>${sigBoxes}</tr>
        </table>
      </div>
    `;
  }

  const fullDocumentHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${options.title}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: letter;
          margin: 0.6in 0.6in 0.6in 0.6in;
          mso-header-margin: 0.3in;
          mso-footer-margin: 0.3in;
        }
        body {
          font-family: Calibri, 'Segoe UI', Arial, sans-serif;
          color: #1e293b;
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      <!-- TOP CORPORATE LETTERHEAD -->
      <table style="width: 100%; border-bottom: 2pt solid #0f172a; padding-bottom: 8pt; margin-bottom: 10pt;">
        <tr>
          <td style="vertical-align: top;">
            <div style="font-size: 16pt; font-weight: 900; color: #0f172a; letter-spacing: -0.3pt;">APEX MANUFACTURING ENTERPRISE</div>
            <div style="font-size: 8.5pt; font-weight: bold; color: #2563eb; letter-spacing: 0.5pt; text-transform: uppercase;">Next-Gen Precision Electronics, Aerospace & Telecom Systems</div>
            <div style="font-size: 7.5pt; color: #64748b; margin-top: 2pt; line-height: 1.3;">
              Global Headquarters: 100 Innovation Boulevard, Tech Ridge Cleanroom Campus, Austin, TX 78758<br/>
              Phone: +1 (800) 555-APEX | CAGE Code: 7Z9A1 | DUNS: 08-941-2094 | ISO 9001:2015 & AS9100D Certified
            </div>
          </td>
          <td style="vertical-align: top; text-align: right; width: 200pt;">
            <div style="background-color: #f1f5f9; border: 1px solid #cbd5e1; padding: 4pt 8pt; text-align: left; border-radius: 3pt;">
              <div style="font-size: 7.5pt; color: #64748b; text-transform: uppercase; font-weight: bold;">Document Reference</div>
              <div style="font-size: 9.5pt; font-weight: bold; color: #0f172a; font-family: Consolas, monospace;">${options.documentRef}</div>
              <div style="font-size: 7.5pt; color: #64748b; margin-top: 2pt;">Effective Date: <strong style="color: #0f172a;">${currentDate}</strong></div>
              <div style="font-size: 7.5pt; color: #64748b;">Department: <strong style="color: #0f172a;">${options.department}</strong></div>
            </div>
          </td>
        </tr>
      </table>

      <!-- CLASSIFICATION BANNER -->
      <div style="text-align: center; margin-bottom: 8pt;">
        <span style="font-size: 7.5pt; font-weight: 800; color: #b91c1c; letter-spacing: 1pt; background-color: #fee2e2; padding: 2pt 8pt; border: 1px solid #f87171; border-radius: 2pt;">
          ${classification}
        </span>
      </div>

      <!-- MAIN DOCUMENT TITLE -->
      <h1 style="font-size: 14pt; font-weight: 900; color: #0f172a; margin: 0 0 6pt 0; line-height: 1.2;">
        ${options.title}
      </h1>

      <!-- EXECUTIVE ABSTRACT / SYNOPSIS -->
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 3pt solid #0f172a; padding: 6pt 10pt; margin-bottom: 12pt;">
        <strong style="font-size: 8.5pt; color: #0f172a; text-transform: uppercase; display: block; margin-bottom: 2pt;">Executive Synopsis & Authority Scope:</strong>
        <p style="font-size: 9pt; color: #334155; line-height: 1.4; margin: 0;">${options.summary}</p>
      </div>

      <!-- DOCUMENT SECTIONS -->
      ${sectionsHtml}

      <!-- SIGNATORIES BLOCK -->
      ${signatoriesHtml}

      <!-- LEGAL FOOTER -->
      <div style="margin-top: 18pt; padding-top: 6pt; border-top: 1px solid #e2e8f0; font-size: 7pt; color: #94a3b8; text-align: center;">
        This document was synthesized in high precision by the Apex Manufacturing Enterprise Operating System.<br/>
        All rights reserved © ${new Date().getFullYear()} Apex Manufacturing Technologies Inc. Export Controlled under EAR99 and ITAR Class VIII.
      </div>
    </body>
    </html>
  `;

  // Trigger download as .doc file
  const blob = new Blob(['\ufeff', fullDocumentHtml], {
    type: 'application/msword',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.doc') ? filename : `${filename}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
