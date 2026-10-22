/**
 * Apex Enterprise Word Document (.doc) Generator
 * Generates rich, professional, corporate Microsoft Word documents
 * with official company letterhead, metadata, detailed tables, signatures, and legal notices.
 */

export interface WordDocOptions {
  title: string;
  documentRef: string;
  classification?: string;
  department: string;
  author: string;
  date?: string;
  summary: string;
  sections: {
    heading: string;
    content?: string[];
    table?: {
      headers: string[];
      rows: (string | number)[][];
    };
    callout?: {
      title: string;
      text: string;
      type?: 'info' | 'warning' | 'success';
    };
  }[];
  signatories?: {
    name: string;
    role: string;
    organization: string;
    signatureDate: string;
  }[];
}

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
          .map((p) => `<p style="font-size: 11pt; line-height: 1.6; color: #2d3748; margin-bottom: 8pt;">${p}</p>`)
          .join('');
      }

      let calloutHtml = '';
      if (sec.callout) {
        const bg = sec.callout.type === 'success' ? '#f0fdf4' : sec.callout.type === 'warning' ? '#fffbeb' : '#eff6ff';
        const border = sec.callout.type === 'success' ? '#16a34a' : sec.callout.type === 'warning' ? '#d97706' : '#2563eb';
        calloutHtml = `
          <div style="background-color: ${bg}; border-left: 4pt solid ${border}; padding: 10pt 14pt; margin: 12pt 0; font-size: 10.5pt;">
            <strong style="color: ${border}; display: block; margin-bottom: 3pt;">${sec.callout.title}</strong>
            <span style="color: #374151;">${sec.callout.text}</span>
          </div>
        `;
      }

      let tableHtml = '';
      if (sec.table && sec.table.headers.length > 0) {
        const headerCells = sec.table.headers
          .map(
            (h) =>
              `<th style="background-color: #1e293b; color: #ffffff; padding: 8pt 10pt; font-size: 10pt; text-align: left; border: 1px solid #cbd5e1;">${h}</th>`
          )
          .join('');

        const rowTrs = sec.table.rows
          .map((row, rIdx) => {
            const bg = rIdx % 2 === 0 ? '#ffffff' : '#f8fafc';
            const cells = row
              .map(
                (cell) =>
                  `<td style="padding: 7pt 10pt; font-size: 9.5pt; color: #334155; border: 1px solid #cbd5e1;">${cell}</td>`
              )
              .join('');
            return `<tr style="background-color: ${bg};">${cells}</tr>`;
          })
          .join('');

        tableHtml = `
          <table style="width: 100%; border-collapse: collapse; margin: 14pt 0; font-family: Calibri, Arial, sans-serif;">
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
        <div style="margin-bottom: 22pt;">
          <h2 style="font-size: 14pt; font-weight: bold; color: #0f172a; border-bottom: 1.5pt solid #e2e8f0; padding-bottom: 4pt; margin-bottom: 10pt;">
            ${idx + 1}. ${sec.heading}
          </h2>
          ${contentHtml}
          ${calloutHtml}
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
        <td style="width: ${Math.floor(100 / options.signatories!.length)}%; vertical-align: top; padding: 12pt; border: 1px solid #e2e8f0; background-color: #f8fafc;">
          <div style="font-size: 9pt; color: #64748b; text-transform: uppercase; font-weight: bold;">Authorized Signatory</div>
          <div style="height: 38pt; border-bottom: 1px dashed #94a3b8; margin: 8pt 0 4pt 0; display: flex; align-items: flex-end;">
            <span style="font-family: 'Brush Script MT', cursive; font-size: 16pt; color: #1e3a8a;">${sig.name}</span>
          </div>
          <div style="font-size: 10pt; font-weight: bold; color: #0f172a;">${sig.name}</div>
          <div style="font-size: 9pt; color: #475569;">${sig.role}</div>
          <div style="font-size: 8.5pt; color: #64748b;">${sig.organization}</div>
          <div style="font-size: 8pt; color: #059669; font-weight: bold; margin-top: 4pt;">Validated: ${sig.signatureDate}</div>
        </td>
      `
      )
      .join('');

    signatoriesHtml = `
      <div style="margin-top: 30pt; page-break-inside: avoid;">
        <h3 style="font-size: 12pt; font-weight: bold; color: #0f172a; margin-bottom: 8pt;">Execution & Digital Governance Authorization</h3>
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
          margin: 1.0in 1.0in 1.0in 1.0in;
          mso-header-margin: 0.5in;
          mso-footer-margin: 0.5in;
        }
        body {
          font-family: Calibri, 'Segoe UI', Arial, sans-serif;
          color: #1e293b;
        }
      </style>
    </head>
    <body>
      <!-- TOP CORPORATE LETTERHEAD -->
      <table style="width: 100%; border-bottom: 2.5pt solid #0f172a; padding-bottom: 12pt; margin-bottom: 18pt;">
        <tr>
          <td style="vertical-align: top;">
            <div style="font-size: 20pt; font-weight: 900; color: #0f172a; letter-spacing: -0.5pt;">APEX MANUFACTURING & MES</div>
            <div style="font-size: 9.5pt; font-weight: bold; color: #2563eb; letter-spacing: 1pt; text-transform: uppercase;">Next-Gen Precision Electronics & Telecom Systems</div>
            <div style="font-size: 8.5pt; color: #64748b; margin-top: 4pt;">
              Global Headquarters: 100 Innovation Boulevard, Tech Ridge Cleanroom Campus, Austin, TX 78758<br/>
              Phone: +1 (800) 555-APEX | CAGE Code: 7Z9A1 | DUNS: 08-941-2094 | ISO 9001:2015 & IATF 16949 Certified
            </div>
          </td>
          <td style="vertical-align: top; text-align: right; width: 220pt;">
            <div style="background-color: #f1f5f9; border: 1px solid #cbd5e1; padding: 6pt 10pt; text-align: left; border-radius: 4pt;">
              <div style="font-size: 8pt; color: #64748b; text-transform: uppercase; font-weight: bold;">Document Reference</div>
              <div style="font-size: 11pt; font-weight: bold; color: #0f172a; font-family: Consolas, monospace;">${options.documentRef}</div>
              <div style="font-size: 8pt; color: #64748b; margin-top: 4pt;">Effective Date: <strong style="color: #0f172a;">${currentDate}</strong></div>
              <div style="font-size: 8pt; color: #64748b;">Department: <strong style="color: #0f172a;">${options.department}</strong></div>
            </div>
          </td>
        </tr>
      </table>

      <!-- CLASSIFICATION BANNER -->
      <div style="text-align: center; margin-bottom: 14pt;">
        <span style="font-size: 8pt; font-weight: 800; color: #b91c1c; letter-spacing: 1.5pt; background-color: #fee2e2; padding: 3pt 10pt; border: 1px solid #f87171; border-radius: 2pt;">
          ${classification}
        </span>
      </div>

      <!-- MAIN DOCUMENT TITLE -->
      <h1 style="font-size: 18pt; font-weight: 900; color: #0f172a; margin: 0 0 8pt 0; line-height: 1.25;">
        ${options.title}
      </h1>

      <!-- EXECUTIVE ABSTRACT / SYNOPSIS -->
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 3.5pt solid #0f172a; padding: 10pt 14pt; margin-bottom: 20pt;">
        <strong style="font-size: 10pt; color: #0f172a; text-transform: uppercase; display: block; margin-bottom: 3pt;">Executive Abstract & Purpose:</strong>
        <p style="font-size: 10.5pt; color: #334155; line-height: 1.5; margin: 0;">${options.summary}</p>
      </div>

      <!-- DOCUMENT SECTIONS -->
      ${sectionsHtml}

      <!-- SIGNATORIES BLOCK -->
      ${signatoriesHtml}

      <!-- LEGAL FOOTER -->
      <div style="margin-top: 36pt; padding-top: 10pt; border-top: 1px solid #e2e8f0; font-size: 8pt; color: #94a3b8; text-align: center;">
        This official instrument was synthesized by the Apex Manufacturing Enterprise Operating System.<br/>
        All rights reserved © ${new Date().getFullYear()} Apex Manufacturing Technologies Corporation. Unauthorized dissemination, reproduction, or duplication is strictly prohibited under Federal Trade Secret and Defense Trade Control Regulations.
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
